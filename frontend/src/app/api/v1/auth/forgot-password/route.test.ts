import { POST } from "./route";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/auth-helpers";
import { sendPasswordResetEmail } from "@/lib/mail";
import crypto from "crypto";
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

jest.mock("@/lib/mail", () => ({
  sendPasswordResetEmail: jest.fn(),
}));

const mockPrisma = prisma as unknown as {
  user: {
    findUnique: jest.Mock;
    update: jest.Mock;
  };
};

const mockHashToken = hashToken as jest.Mock;
const mockSendPasswordResetEmail = sendPasswordResetEmail as jest.Mock;

const createRequest = (body?: object) =>
  new NextRequest("http://localhost/api/v1/auth/forgot-password", {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });

const user = {
  id: "u1",
  email: "john@example.com",
  name: "John Doe",
};

describe("POST /api/v1/auth/forgot-password", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should generate a reset token and send a password reset email", async () => {
    jest
      .spyOn(crypto, "randomBytes")
      .mockImplementation(() => Buffer.from("random-token"));

    mockPrisma.user.findUnique.mockResolvedValue(user);
    mockHashToken.mockReturnValue("hashed-reset-token");

    const response = await POST(
      createRequest({
        email: user.email,
      }),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.message).toBe(
      "If that email exists, a reset link has been sent",
    );

    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: user.email },
    });

    expect(mockHashToken).toHaveBeenCalledWith(
      Buffer.from("random-token").toString("hex"),
    );

    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: "u1" },
      data: {
        resetTokenHash: "hashed-reset-token",
        resetTokenExpiry: expect.any(Date),
      },
    });

    expect(mockSendPasswordResetEmail).toHaveBeenCalledWith(
      "john@example.com",
      "John Doe",
      Buffer.from("random-token").toString("hex"),
    );
  });

  it("should return 400 when email is missing", async () => {
    const response = await POST(createRequest({}), {});
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toBe("Email is required");

    expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
    expect(mockPrisma.user.update).not.toHaveBeenCalled();
    expect(mockSendPasswordResetEmail).not.toHaveBeenCalled();
  });

  it("should return 400 when email is not a string", async () => {
    const response = await POST(
      createRequest({
        email: 123,
      }),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toBe("Email is required");

    expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
  });

  it("should return the safe message when the user does not exist", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    const response = await POST(
      createRequest({
        email: "unknown@example.com",
      }),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.message).toBe(
      "If that email exists, a reset link has been sent",
    );

    expect(mockPrisma.user.update).not.toHaveBeenCalled();
    expect(mockHashToken).not.toHaveBeenCalled();
    expect(mockSendPasswordResetEmail).not.toHaveBeenCalled();
  });
});
