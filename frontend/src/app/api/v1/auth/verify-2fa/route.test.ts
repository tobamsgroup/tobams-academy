import { POST } from "./route";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/auth-helpers";
import { signTokens } from "@/lib/jwt";
import { NextRequest } from "next/server";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock("@/lib/auth-helpers", () => ({
  hashToken: jest.fn(),
}));

jest.mock("@/lib/jwt", () => ({
  signTokens: jest.fn(),
}));

const mockPrisma = prisma as unknown as {
  user: {
    findUnique: jest.Mock;
    update: jest.Mock;
  };
};

const mockHashToken = hashToken as jest.Mock;
const mockSignTokens = signTokens as jest.Mock;

const createRequest = (body?: object) =>
  new NextRequest("http://localhost/api/v1/auth/verify-2fa", {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });

const future = new Date(Date.now() + 10 * 60 * 1000);
const past = new Date(Date.now() - 10 * 60 * 1000);

const user = {
  id: "u1",
  name: "John",
  email: "john@example.com",
  role: "LEARNER",
  twoFactorOtpHash: "hashed-otp",
  twoFactorOtpExpiry: future,
};

describe("POST /api/v1/auth/verify-2fa", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should verify the OTP and return authentication tokens", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(user);

    mockHashToken.mockReturnValue("hashed-otp");

    mockSignTokens.mockReturnValue({
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });

    const response = await POST(
      createRequest({
        userId: "u1",
        otp: "123456",
      }),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data).toEqual({
      accessToken: "access-token",
      refreshToken: "refresh-token",
      user: {
        id: "u1",
        name: "John",
        email: "john@example.com",
        role: "LEARNER",
      },
    });

    expect(body.message).toBe("Login successful");

    expect(mockHashToken).toHaveBeenCalledWith("123456");

    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: "u1" },
      data: {
        twoFactorOtpHash: null,
        twoFactorOtpExpiry: null,
      },
    });

    expect(mockSignTokens).toHaveBeenCalledWith(
      "u1",
      "john@example.com",
      "LEARNER",
    );
  });

  it("should return 400 when userId is missing", async () => {
    const response = await POST(
      createRequest({
        otp: "123456",
      }),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toBe("userId is required");

    expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
  });

  it("should return 400 when otp is missing", async () => {
    const response = await POST(
      createRequest({
        userId: "u1",
      }),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toBe("otp is required");

    expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
  });

  it("should return 401 when user does not exist", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    const response = await POST(
      createRequest({
        userId: "u1",
        otp: "123456",
      }),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.message).toBe("Invalid request");

    expect(mockHashToken).not.toHaveBeenCalled();
    expect(mockSignTokens).not.toHaveBeenCalled();
  });

  it("should return 401 when there is no pending 2FA verification", async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      ...user,
      twoFactorOtpHash: null,
      twoFactorOtpExpiry: null,
    });

    const response = await POST(
      createRequest({
        userId: "u1",
        otp: "123456",
      }),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.message).toBe(
      "No pending 2FA verification. Please log in again.",
    );

    expect(mockHashToken).not.toHaveBeenCalled();
    expect(mockSignTokens).not.toHaveBeenCalled();
  });

  it("should return 401 when the verification code has expired", async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      ...user,
      twoFactorOtpExpiry: past,
    });

    const response = await POST(
      createRequest({
        userId: "u1",
        otp: "123456",
      }),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.message).toBe(
      "Verification code has expired. Please log in again.",
    );

    expect(mockHashToken).not.toHaveBeenCalled();
    expect(mockSignTokens).not.toHaveBeenCalled();
  });

  it("should return 401 when the verification code is incorrect", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(user);

    mockHashToken.mockReturnValue("wrong-hash");

    const response = await POST(
      createRequest({
        userId: "u1",
        otp: "654321",
      }),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.message).toBe("Invalid verification code");

    expect(mockPrisma.user.update).not.toHaveBeenCalled();
    expect(mockSignTokens).not.toHaveBeenCalled();
  });
});
