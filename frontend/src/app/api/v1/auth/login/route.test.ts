import { POST } from "./route";
import { prisma } from "@/lib/prisma";
import { comparePassword, hashToken } from "@/lib/auth-helpers";
import { signTokens } from "@/lib/jwt";
import { sendTwoFactorOtpEmail } from "@/lib/mail";
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
  comparePassword: jest.fn(),
  hashToken: jest.fn(),
}));

jest.mock("@/lib/jwt", () => ({
  signTokens: jest.fn(),
}));

jest.mock("@/lib/mail", () => ({
  sendTwoFactorOtpEmail: jest.fn(),
}));

const mockPrisma = prisma as unknown as {
  user: {
    findUnique: jest.Mock;
    update: jest.Mock;
  };
};

const mockComparePassword = comparePassword as jest.Mock;
const mockSignTokens = signTokens as jest.Mock;
const mockHashToken = hashToken as jest.Mock;
const mockSendTwoFactorOtpEmail = sendTwoFactorOtpEmail as jest.Mock;

const createRequest = (body?: object) =>
  new NextRequest("http://localhost/api/v1/auth/login", {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });

const user = {
  id: "u1",
  email: "test@test.com",
  name: "John",
  passwordHash: "hashed-password",
  role: "LEARNER",
  emailVerified: true,
  isActive: true,
  twoFactorEnabled: false,
};

describe("POST /api/v1/auth/login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should login successfully and return tokens", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(user);
    mockComparePassword.mockResolvedValue(true);

    mockSignTokens.mockReturnValue({
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });

    const response = await POST(
      createRequest({
        email: user.email,
        password: "password123",
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
        email: "test@test.com",
        role: "LEARNER",
      },
    });

    expect(body.message).toBe("Login successful");

    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "test@test.com" },
    });

    expect(mockComparePassword).toHaveBeenCalledWith(
      "password123",
      "hashed-password",
    );

    expect(mockSignTokens).toHaveBeenCalledWith(
      "u1",
      "test@test.com",
      "LEARNER",
    );

    expect(mockSendTwoFactorOtpEmail).not.toHaveBeenCalled();
  });

  it("should return 400 if email or password is missing", async () => {
    const response = await POST(
      createRequest({
        email: "test@test.com",
      }),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toBe("Email and password are required");

    expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
  });

  it("should return 401 if user does not exist", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    const response = await POST(
      createRequest({
        email: "test@test.com",
        password: "password123",
      }),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.message).toBe("Invalid credentials");

    expect(mockComparePassword).not.toHaveBeenCalled();
    expect(mockSignTokens).not.toHaveBeenCalled();
  });

  it("should return 401 if password is incorrect", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(user);
    mockComparePassword.mockResolvedValue(false);

    const response = await POST(
      createRequest({
        email: "test@test.com",
        password: "wrong-password",
      }),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.message).toBe("Invalid credentials");

    expect(mockComparePassword).toHaveBeenCalledWith(
      "wrong-password",
      "hashed-password",
    );

    expect(mockSignTokens).not.toHaveBeenCalled();
  });

  it("should return 401 if email is not verified", async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      ...user,
      emailVerified: false,
    });

    mockComparePassword.mockResolvedValue(true);

    const response = await POST(
      createRequest({
        email: "test@test.com",
        password: "password123",
      }),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.message).toBe("Please verify your email before logging in");

    expect(mockSignTokens).not.toHaveBeenCalled();
  });

  it("should reactivate an inactive account and continue login", async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      ...user,
      isActive: false,
    });

    mockComparePassword.mockResolvedValue(true);

    mockSignTokens.mockReturnValue({
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });

    const response = await POST(
      createRequest({
        email: "test@test.com",
        password: "password123",
      }),
      {},
    );

    expect(response.status).toBe(200);

    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: {
        id: "u1",
      },
      data: {
        isActive: true,
        deactivatedAt: null,
        deactivationReason: null,
      },
    });

    expect(mockSignTokens).toHaveBeenCalled();
  });

  it("should send an OTP when two-factor authentication is enabled", async () => {
    jest.spyOn(Math, "random").mockReturnValue(0.123456);

    mockPrisma.user.findUnique.mockResolvedValue({
      ...user,
      twoFactorEnabled: true,
    });

    mockComparePassword.mockResolvedValue(true);
    mockHashToken.mockReturnValue("hashed-otp");

    const response = await POST(
      createRequest({
        email: user.email,
        password: "password123",
      }),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data).toEqual({
      twoFactorRequired: true,
      userId: "u1",
    });

    expect(body.message).toBe("Verification code sent to your email");

    expect(mockHashToken).toHaveBeenCalledWith(expect.any(String));

    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: "u1" },
      data: expect.objectContaining({
        twoFactorOtpHash: "hashed-otp",
        twoFactorOtpExpiry: expect.any(Date),
      }),
    });

    expect(mockSendTwoFactorOtpEmail).toHaveBeenCalledWith(
      "test@test.com",
      "John",
      expect.any(String),
    );

    expect(mockSignTokens).not.toHaveBeenCalled();
  });
});
