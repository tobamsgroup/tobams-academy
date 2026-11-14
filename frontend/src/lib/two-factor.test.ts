import { issueSignInCode, OTP_MAX_ATTEMPTS, verifySignInCode } from "./two-factor";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/auth-helpers";
import { sendTwoFactorOtpEmail } from "@/lib/mail";

jest.mock("@/lib/prisma", () => ({ prisma: { user: { update: jest.fn() } } }));
jest.mock("@/lib/mail", () => ({ sendTwoFactorOtpEmail: jest.fn() }));

const db = prisma as unknown as { user: { update: jest.Mock } };
const now = new Date("2026-11-14T12:00:00Z");
const base = { id: "u1", email: "a@b.com", name: "A", twoFactorOtpHash: null, twoFactorOtpExpiry: null, twoFactorOtpAttempts: 0 };

beforeEach(() => jest.clearAllMocks());

describe("issueSignInCode", () => {
  it("emails a 6-digit code and stores only its hash, valid for 10 minutes", async () => {
    expect(await issueSignInCode(base, now)).toBe(true);
    const code = (sendTwoFactorOtpEmail as jest.Mock).mock.calls[0][2] as string;
    expect(code).toMatch(/^\d{6}$/);
    const data = db.user.update.mock.calls[0][0].data;
    expect(data.twoFactorOtpHash).toBe(hashToken(code));
    expect(data.twoFactorOtpExpiry.getTime() - now.getTime()).toBe(10 * 60 * 1000);
    expect(data.twoFactorOtpAttempts).toBe(0);
  });

  it("doesn't email again within 30 seconds of the last code", async () => {
    const justSent = { ...base, twoFactorOtpHash: "h", twoFactorOtpExpiry: new Date(now.getTime() + 10 * 60 * 1000 - 10_000) };
    expect(await issueSignInCode(justSent, now)).toBe(false);
    expect(sendTwoFactorOtpEmail).not.toHaveBeenCalled();
  });
});

describe("verifySignInCode", () => {
  const pending = { ...base, twoFactorOtpHash: hashToken("123456"), twoFactorOtpExpiry: new Date(now.getTime() + 60_000) };

  it("accepts the right code once and clears it", async () => {
    expect(await verifySignInCode(pending, "123456", now)).toBe("ok");
    expect(db.user.update.mock.calls[0][0].data).toEqual({ twoFactorOtpHash: null, twoFactorOtpExpiry: null, twoFactorOtpAttempts: 0 });
  });

  it("counts wrong codes and cancels the code after too many", async () => {
    expect(await verifySignInCode(pending, "000000", now)).toBe("invalid");
    expect(db.user.update.mock.calls[0][0].data).toEqual({ twoFactorOtpAttempts: 1 });

    const lastTry = { ...pending, twoFactorOtpAttempts: OTP_MAX_ATTEMPTS - 1 };
    expect(await verifySignInCode(lastTry, "000000", now)).toBe("expired");
    expect(db.user.update.mock.calls[1][0].data.twoFactorOtpHash).toBeNull();

    // even the right code is refused once attempts are used up
    expect(await verifySignInCode({ ...pending, twoFactorOtpAttempts: OTP_MAX_ATTEMPTS }, "123456", now)).toBe("expired");
  });

  it("rejects expired or missing codes", async () => {
    expect(await verifySignInCode({ ...pending, twoFactorOtpExpiry: new Date(now.getTime() - 1) }, "123456", now)).toBe("expired");
    expect(await verifySignInCode(base, "123456", now)).toBe("expired");
  });
});
