import { adminEnroll, generateTemporaryPassword, nameFromEmail, parseTargets } from "./admin-enroll";
import { prisma } from "@/lib/prisma";
import { sendCourseEnrollmentEmail } from "@/lib/mail";
import { isStrongPassword } from "@/lib/password-rules";
import { comparePassword } from "@/lib/auth-helpers";

jest.mock("@/lib/prisma", () => {
  const tx = { payment: { create: jest.fn() }, enrollment: { upsert: jest.fn() } };
  return {
    prisma: {
      user: { findUnique: jest.fn(), create: jest.fn() },
      enrollment: { findUnique: jest.fn() },
      $transaction: jest.fn(async (fn: (t: typeof tx) => unknown) => fn(tx)),
      __tx: tx,
    },
  };
});
jest.mock("@/lib/mail", () => ({ sendCourseEnrollmentEmail: jest.fn() }));
jest.mock("@/lib/notifications", () => ({ notify: jest.fn() }));

type M = jest.Mock;
const db = prisma as unknown as {
  user: { findUnique: M; create: M };
  enrollment: { findUnique: M };
  __tx: { payment: { create: M }; enrollment: { upsert: M } };
};
const course = { id: "c1", slug: "time-intelligence-masterclass", title: "Time Intelligence Masterclass" };

beforeEach(() => jest.clearAllMocks());

describe("helpers", () => {
  it("generates temporary passwords that meet the password rules", () => {
    for (let i = 0; i < 50; i++) expect(isStrongPassword(generateTemporaryPassword())).toBe(true);
  });

  it("derives a display name from an email", () => {
    expect(nameFromEmail("jane.doe@x.com")).toBe("Jane Doe");
    expect(nameFromEmail("bola_ade+tga@y.com")).toBe("Bola Ade Tga");
  });

  it("validates, normalises and de-duplicates input", () => {
    const { targets, invalid } = parseTargets([
      " Jane@X.com ",
      "jane@x.com",
      { email: "bola@y.com", name: "Bola Ade" },
      "not-an-email",
    ]);
    expect(targets).toEqual([{ email: "jane@x.com", name: undefined }, { email: "bola@y.com", name: "Bola Ade" }]);
    expect(invalid).toEqual([{ email: "not-an-email", status: "failed", reason: "Not a valid email address" }]);
  });
});

describe("adminEnroll", () => {
  it("creates a verified account with a temporary password for a new email", async () => {
    db.user.findUnique.mockResolvedValue(null);
    db.user.create.mockImplementation(async ({ data }) => ({ id: "u1", ...data }));
    db.enrollment.findUnique.mockResolvedValue(null);

    const result = await adminEnroll(course, { email: "new@x.com" });

    expect(result.status).toBe("created");
    const created = db.user.create.mock.calls[0][0].data;
    expect(created).toMatchObject({ email: "new@x.com", name: "New", emailVerified: true });
    const mail = (sendCourseEnrollmentEmail as M).mock.calls[0][0];
    expect(mail.temporaryPassword).toBeDefined();
    // the stored hash matches the password that was emailed
    expect(await comparePassword(mail.temporaryPassword, created.passwordHash)).toBe(true);
    expect(db.__tx.payment.create.mock.calls[0][0].data).toMatchObject({
      amount: 0,
      status: "COMPLETED",
      paymentMethod: "Complimentary enrollment",
    });
    expect(db.__tx.enrollment.upsert).toHaveBeenCalled();
  });

  it("enrolls an existing account without touching its password", async () => {
    db.user.findUnique.mockResolvedValue({ id: "u2", email: "old@x.com", name: "Old" });
    db.enrollment.findUnique.mockResolvedValue(null);

    const result = await adminEnroll(course, { email: "old@x.com" });

    expect(result.status).toBe("enrolled");
    expect(db.user.create).not.toHaveBeenCalled();
    expect((sendCourseEnrollmentEmail as M).mock.calls[0][0].temporaryPassword).toBeUndefined();
  });

  it("renews access for someone already enrolled", async () => {
    db.user.findUnique.mockResolvedValue({ id: "u3", email: "back@x.com", name: "Back" });
    db.enrollment.findUnique.mockResolvedValue({ id: "e3" });

    expect((await adminEnroll(course, { email: "back@x.com" })).status).toBe("renewed");
  });

  it("reports a failure instead of throwing", async () => {
    db.user.findUnique.mockRejectedValue(new Error("db down"));
    expect(await adminEnroll(course, { email: "x@x.com" })).toEqual({ email: "x@x.com", status: "failed", reason: "db down" });
  });
});
