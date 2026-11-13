import { CheckoutError, completeSimulatedSession, startCheckout, syncCheckoutSession } from "./checkout";
import { prisma } from "@/lib/prisma";
import { notify } from "@/lib/notifications";
import { getStripe } from "@/lib/stripe";

jest.mock("@/lib/prisma", () => {
  const tx = {
    payment: { create: jest.fn(), updateMany: jest.fn() },
    enrollment: { createMany: jest.fn() },
  };
  return {
    prisma: {
      course: { findMany: jest.fn() },
      enrollment: { findMany: jest.fn() },
      payment: { createMany: jest.fn(), findMany: jest.fn(), findFirst: jest.fn(), updateMany: jest.fn() },
      cartItem: { deleteMany: jest.fn() },
      $transaction: jest.fn(async (fn: (t: typeof tx) => unknown) => fn(tx)),
      __tx: tx,
    },
  };
});
jest.mock("@/lib/notifications", () => ({ notify: jest.fn() }));
jest.mock("@/lib/stripe", () => {
  const stripe = { checkout: { sessions: { create: jest.fn(), retrieve: jest.fn() } } };
  return { getStripe: () => stripe, PaymentsNotConfiguredError: class extends Error {} };
});

type Mock = jest.Mock;
const db = prisma as unknown as {
  course: { findMany: Mock };
  enrollment: { findMany: Mock };
  payment: { createMany: Mock; findMany: Mock; findFirst: Mock; updateMany: Mock };
  cartItem: { deleteMany: Mock };
  __tx: { payment: { create: Mock; updateMany: Mock }; enrollment: { createMany: Mock } };
};
const stripe = getStripe() as unknown as { checkout: { sessions: { create: Mock; retrieve: Mock } } };

const course = (id: string, price: number | null, earlyBirdPrice: number | null = null) => ({
  id,
  slug: `course-${id}`,
  title: `Course ${id}`,
  description: "",
  thumbnail: null,
  price,
  earlyBirdPrice,
  status: "PUBLISHED",
  category: { name: "Cat" },
});

const user = { id: "u1", email: "learner@example.com" };

beforeEach(() => {
  jest.clearAllMocks();
  db.enrollment.findMany.mockResolvedValue([]);
  // Don't depend on the developer's .env (next/jest loads it): default to Stripe.
  delete process.env.PAYMENT_PROVIDER;
});

describe("startCheckout", () => {
  it("enrolls immediately without Stripe when the total is free", async () => {
    db.course.findMany.mockResolvedValue([course("a", null), course("b", 0)]);

    const result = await startCheckout(user, ["a", "b"]);

    expect(result).toEqual({
      status: "enrolled",
      courses: [
        { id: "a", slug: "course-a", title: "Course a" },
        { id: "b", slug: "course-b", title: "Course b" },
      ],
    });
    expect(stripe.checkout.sessions.create).not.toHaveBeenCalled();
    expect(db.__tx.enrollment.createMany).toHaveBeenCalledWith(
      expect.objectContaining({ skipDuplicates: true }),
    );
    expect(db.cartItem.deleteMany).toHaveBeenCalled();
    expect(notify).toHaveBeenCalledTimes(2);
  });

  it("creates a Stripe session charging the early-bird price in pence, with PENDING payments", async () => {
    db.course.findMany.mockResolvedValue([course("ti", 699, 299), course("free", null)]);
    stripe.checkout.sessions.create.mockResolvedValue({ id: "cs_1", url: "https://checkout.stripe.test/cs_1" });

    const result = await startCheckout(user, ["ti", "free"]);

    expect(result).toEqual({ status: "redirect", url: "https://checkout.stripe.test/cs_1" });
    const args = stripe.checkout.sessions.create.mock.calls[0][0];
    expect(args.mode).toBe("payment");
    expect(args.customer_email).toBe("learner@example.com");
    // Only paid courses become Stripe line items.
    expect(args.line_items).toEqual([
      expect.objectContaining({ price_data: expect.objectContaining({ currency: "gbp", unit_amount: 29900 }) }),
    ]);
    // Every course in the order gets a PENDING payment tied to the session.
    const payments = db.payment.createMany.mock.calls[0][0].data;
    expect(payments).toEqual([
      expect.objectContaining({ courseId: "ti", amount: 299, status: "PENDING", checkoutSessionId: "cs_1" }),
      expect.objectContaining({ courseId: "free", amount: 0, status: "PENDING", checkoutSessionId: "cs_1" }),
    ]);
  });

  it("refuses courses the user already owns", async () => {
    db.course.findMany.mockResolvedValue([course("a", 50)]);
    db.enrollment.findMany.mockResolvedValue([{ courseId: "a" }]);

    await expect(startCheckout(user, ["a"])).rejects.toMatchObject({ status: 409 });
    expect(stripe.checkout.sessions.create).not.toHaveBeenCalled();
  });

  it("rejects unknown or unpublished courses and empty carts", async () => {
    db.course.findMany.mockResolvedValue([]);
    await expect(startCheckout(user, ["missing"])).rejects.toMatchObject({ status: 404 });
    await expect(startCheckout(user, [])).rejects.toBeInstanceOf(CheckoutError);
  });
});

describe("syncCheckoutSession", () => {
  const payments = [
    { userId: "u1", amount: 299, status: "PENDING", course: { id: "ti", slug: "ti", title: "Time Intelligence" } },
  ];

  it("completes the order once: enrolls, clears the cart and notifies", async () => {
    db.payment.findMany.mockResolvedValue(payments);
    stripe.checkout.sessions.retrieve.mockResolvedValue({ payment_status: "paid", payment_intent: "pi_1" });
    db.__tx.payment.updateMany.mockResolvedValueOnce({ count: 1 }).mockResolvedValueOnce({ count: 0 });

    const first = await syncCheckoutSession("cs_1", { userId: "u1" });
    const second = await syncCheckoutSession("cs_1", { userId: "u1" });

    expect(first?.status).toBe("paid");
    expect(second?.status).toBe("paid");
    expect(db.__tx.payment.updateMany).toHaveBeenCalledWith({
      where: { checkoutSessionId: "cs_1", status: "PENDING" },
      data: { status: "COMPLETED", transactionId: "pi_1" },
    });
    expect(db.__tx.enrollment.createMany).toHaveBeenCalledTimes(2); // idempotent
    // Enrollment confirmation + payment receipt, only from the call that claimed the payments.
    expect(notify).toHaveBeenCalledTimes(2);
    expect(notify).toHaveBeenCalledWith("u1", expect.objectContaining({ type: "PAYMENT" }));
  });

  it("does not reveal another user's checkout", async () => {
    db.payment.findMany.mockResolvedValue(payments);
    expect(await syncCheckoutSession("cs_1", { userId: "someone-else" })).toBeNull();
    expect(stripe.checkout.sessions.retrieve).not.toHaveBeenCalled();
  });

  it("marks payments FAILED when the session expired unpaid", async () => {
    db.payment.findMany.mockResolvedValue(payments);
    stripe.checkout.sessions.retrieve.mockResolvedValue({ payment_status: "unpaid", status: "expired" });

    const status = await syncCheckoutSession("cs_1", { userId: "u1" });

    expect(status?.status).toBe("failed");
    expect(db.payment.updateMany).toHaveBeenCalledWith({
      where: { checkoutSessionId: "cs_1", status: "PENDING" },
      data: { status: "FAILED" },
    });
    expect(notify).not.toHaveBeenCalled();
  });

  it("reports pending while Stripe hasn't confirmed payment", async () => {
    db.payment.findMany.mockResolvedValue(payments);
    stripe.checkout.sessions.retrieve.mockResolvedValue({ payment_status: "unpaid", status: "open" });

    expect((await syncCheckoutSession("cs_1", { userId: "u1" }))?.status).toBe("pending");
  });
});

describe("simulated payments (PAYMENT_PROVIDER=simulated)", () => {
  const env = { ...process.env };
  beforeEach(() => {
    process.env = { ...env, PAYMENT_PROVIDER: "simulated", NODE_ENV: "development" } as NodeJS.ProcessEnv;
  });
  afterEach(() => {
    process.env = { ...env };
  });

  const pending = [
    { userId: "u1", amount: 299, status: "PENDING", course: { id: "ti", slug: "ti", title: "Time Intelligence" } },
  ];

  it("redirects to the in-app test payment page instead of Stripe", async () => {
    db.course.findMany.mockResolvedValue([course("ti", 699, 299)]);

    const result = await startCheckout(user, ["ti"]);

    expect(stripe.checkout.sessions.create).not.toHaveBeenCalled();
    expect(result.status).toBe("redirect");
    const url = (result as { url: string }).url;
    expect(url).toMatch(/\/checkout\/test-payment\?session_id=sim_/);
    const payments = db.payment.createMany.mock.calls[0][0].data;
    expect(payments[0]).toMatchObject({ status: "PENDING", amount: 299, paymentMethod: "Test payment" });
    expect(payments[0].checkoutSessionId).toMatch(/^sim_/);
  });

  it("'Pay' runs the same fulfilment as a Stripe confirmation", async () => {
    db.payment.findFirst.mockResolvedValue({ id: "p1" });
    db.payment.findMany.mockResolvedValue(pending);
    db.__tx.payment.updateMany.mockResolvedValue({ count: 1 });

    const status = await completeSimulatedSession("sim_1", "u1", "paid");

    expect(status?.status).toBe("paid");
    expect(stripe.checkout.sessions.retrieve).not.toHaveBeenCalled();
    expect(db.__tx.enrollment.createMany).toHaveBeenCalled();
    expect(notify).toHaveBeenCalledWith("u1", expect.objectContaining({ type: "PAYMENT" }));
  });

  it("'Simulate failed payment' marks the order FAILED", async () => {
    db.payment.findFirst.mockResolvedValue({ id: "p1" });
    db.payment.findMany.mockResolvedValue([{ ...pending[0], status: "FAILED" }]);

    const status = await completeSimulatedSession("sim_1", "u1", "failed");

    expect(db.payment.updateMany).toHaveBeenCalledWith({
      where: { checkoutSessionId: "sim_1", status: "PENDING" },
      data: { status: "FAILED" },
    });
    expect(status?.status).toBe("failed");
  });

  it("cannot settle another user's checkout or a real Stripe session", async () => {
    db.payment.findFirst.mockResolvedValue(null);
    expect(await completeSimulatedSession("sim_1", "someone-else", "paid")).toBeNull();
    expect(await completeSimulatedSession("cs_live_1", "u1", "paid")).toBeNull();
    expect(db.__tx.enrollment.createMany).not.toHaveBeenCalled();
  });

  it("reads a simulated session's status from our records, never from Stripe", async () => {
    db.payment.findMany.mockResolvedValue(pending);
    expect((await syncCheckoutSession("sim_1", { userId: "u1" }))?.status).toBe("pending");
    expect(stripe.checkout.sessions.retrieve).not.toHaveBeenCalled();
  });
});
