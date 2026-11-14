import { POST } from "./route";
import { prisma } from "@/lib/prisma";
import { notify } from "@/lib/notifications";
import { NextRequest } from "next/server";

jest.mock("@/lib/prisma", () => ({
  prisma: { user: { findFirst: jest.fn(), update: jest.fn() } },
}));
jest.mock("@/lib/notifications", () => ({ notify: jest.fn() }));

const db = prisma as unknown as { user: { findFirst: jest.Mock; update: jest.Mock } };
const verify = (token?: string) =>
  POST(new NextRequest(`http://localhost/api/v1/auth/verify-email${token ? `?token=${token}` : ""}`, { method: "POST" }), {});

describe("POST /api/v1/auth/verify-email", () => {
  beforeEach(() => jest.clearAllMocks());

  it("verifies the account the first time the link is used", async () => {
    db.user.findFirst.mockResolvedValue({ id: "u1", emailVerified: false });
    const res = await verify("abc");
    expect(res.status).toBe(200);
    expect(db.user.update).toHaveBeenCalledWith({ where: { id: "u1" }, data: { emailVerified: true } });
    expect(notify).toHaveBeenCalledTimes(1);
  });

  it("still succeeds when the same link is opened again (scanner, double click, reload)", async () => {
    db.user.findFirst.mockResolvedValue({ id: "u1", emailVerified: true });
    const res = await verify("abc");
    expect(res.status).toBe(200);
    expect((await res.json()).message).toBe("Email already verified");
    expect(db.user.update).not.toHaveBeenCalled();
    expect(notify).not.toHaveBeenCalled();
  });

  it("rejects unknown tokens and missing tokens", async () => {
    db.user.findFirst.mockResolvedValue(null);
    expect((await verify("nope")).status).toBe(401);
    expect((await verify()).status).toBe(400);
  });
});
