import { POST } from "./route";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/with-auth";
import { adminEnroll } from "@/lib/admin-enroll";
import { NextRequest } from "next/server";

jest.mock("@/lib/prisma", () => ({ prisma: { course: { findFirst: jest.fn() } } }));
jest.mock("@/lib/with-auth", () => ({ getAuthUser: jest.fn() }));
jest.mock("@/lib/admin-enroll", () => ({
  ...jest.requireActual("@/lib/admin-enroll"),
  adminEnroll: jest.fn(async (_c: unknown, t: { email: string }) => ({ email: t.email, status: "created", expiresAt: "x" })),
}));

const db = prisma as unknown as { course: { findFirst: jest.Mock } };
const KEY = "test-admin-key-123";
const call = (body: unknown, headers: Record<string, string> = { "x-admin-api-key": KEY }) =>
  POST(new NextRequest("http://localhost/api/v1/admin/enrollments", { method: "POST", headers, body: JSON.stringify(body) }), {});

describe("POST /api/v1/admin/enrollments", () => {
  const env = process.env.ADMIN_API_KEY;
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.ADMIN_API_KEY = KEY;
    (getAuthUser as jest.Mock).mockReturnValue(null);
    db.course.findFirst.mockResolvedValue({ id: "c1", slug: "time-intelligence-masterclass", title: "TI" });
  });
  afterAll(() => {
    process.env.ADMIN_API_KEY = env;
  });

  it("rejects requests without the admin key", async () => {
    expect((await call({ emails: ["a@x.com"] }, {})).status).toBe(401);
    expect((await call({ emails: ["a@x.com"] }, { "x-admin-api-key": "wrong" })).status).toBe(401);
    expect(adminEnroll).not.toHaveBeenCalled();
  });

  it("rejects learners even when signed in", async () => {
    (getAuthUser as jest.Mock).mockReturnValue({ id: "u", email: "u@x.com", role: "LEARNER" });
    expect((await call({ emails: ["a@x.com"] }, {})).status).toBe(401);
  });

  it("allows a signed-in admin", async () => {
    (getAuthUser as jest.Mock).mockReturnValue({ id: "u", email: "u@x.com", role: "ADMIN" });
    expect((await call({ emails: ["a@x.com"] }, {})).status).toBe(200);
  });

  it("enrolls each valid email into Time Intelligence by default and reports per email", async () => {
    const res = await call({ emails: ["a@x.com", "B@x.com", "bad"] });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(db.course.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { slug: "time-intelligence-masterclass", status: "PUBLISHED" } }),
    );
    expect(adminEnroll).toHaveBeenCalledTimes(2);
    expect(body.data.summary).toEqual({ created: 2, enrolled: 0, renewed: 0, failed: 1 });
  });

  it("validates the request", async () => {
    expect((await call({ emails: [] })).status).toBe(400);
    expect((await call({ emails: Array.from({ length: 201 }, (_, i) => `u${i}@x.com`) })).status).toBe(400);
    db.course.findFirst.mockResolvedValue(null);
    expect((await call({ emails: ["a@x.com"], courseSlug: "nope" })).status).toBe(404);
  });
});
