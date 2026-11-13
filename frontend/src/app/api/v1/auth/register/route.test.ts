import { POST } from "./route";
import { prisma } from "@/lib/prisma";
import { hashPassword, hashToken } from "@/lib/auth-helpers";
import { sendVerificationEmail } from "@/lib/mail";
import { NextRequest } from "next/server";
import crypto from "crypto";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock("@/lib/auth-helpers", () => ({
  hashPassword: jest.fn(),
  hashToken: jest.fn(),
}));

jest.mock("@/lib/mail", () => ({
  sendVerificationEmail: jest.fn(),
}));

jest.mock("crypto", () => ({
  randomBytes: jest.fn(),
}));

const mockPrisma = prisma as unknown as {
  user: {
    findUnique: jest.Mock;
    create: jest.Mock;
  };
};

const mockHashPassword = hashPassword as jest.Mock;
const mockHashToken = hashToken as jest.Mock;
const mockSendVerificationEmail = sendVerificationEmail as jest.Mock;
const mockRandomBytes = crypto.randomBytes as jest.Mock;

const user = {
  name: "John",
  email: "test@test.com",
  password: "password123",
};

const createRequest = (body?: object) =>
  new NextRequest("http://localhost/api/v1/auth/register", {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });

describe("POST /api/v1/auth/register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should register a new user successfully", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    mockHashPassword.mockResolvedValue("hashed-password");

    mockRandomBytes.mockReturnValue({
      toString: jest.fn().mockReturnValue("raw-token"),
    });

    mockHashToken.mockReturnValue("hashed-token");

    mockPrisma.user.create.mockResolvedValue({
      id: "u1",
      email: "test@test.com",
      name: "John",
    });

    const response = await POST(createRequest(user), {});

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.message).toBe(
      "Registration successful. Please verify your email.",
    );

    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: {
        email: "test@test.com",
      },
    });

    expect(mockHashPassword).toHaveBeenCalledWith("password123");

    expect(mockHashToken).toHaveBeenCalledWith("raw-token");

    expect(mockPrisma.user.create).toHaveBeenCalledWith({
      data: {
        email: "test@test.com",
        name: "John",
        passwordHash: "hashed-password",
        verifyTokenHash: "hashed-token",
      },
    });

    expect(mockSendVerificationEmail).toHaveBeenCalledWith(
      "test@test.com",
      "John",
      "raw-token",
    );
  });

  it("should trim the user's name before saving", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    mockHashPassword.mockResolvedValue("hashed-password");

    mockRandomBytes.mockReturnValue({
      toString: jest.fn().mockReturnValue("raw-token"),
    });

    mockHashToken.mockReturnValue("hashed-token");

    mockPrisma.user.create.mockResolvedValue({
      id: "u1",
      email: "test@test.com",
      name: "John",
    });

    await POST(
      createRequest({
        name: "   John    ",
        email: "test@test.com",
        password: "password123",
      }),
      {},
    );

    expect(mockPrisma.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        name: "John",
      }),
    });
  });

  it("should return 400 if name is missing", async () => {
    const response = await POST(
      createRequest({
        email: "test@test.com",
        password: "password123",
      }),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toBe("Name is required");
  });

  it("should return 400 if email is missing", async () => {
    const response = await POST(
      createRequest({
        name: "John",
        password: "password123",
      }),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toBe("Valid email is required");
  });

  it("should return 400 if email is invalid", async () => {
    const response = await POST(
      createRequest({
        name: "John",
        email: "invalid-email",
        password: "password123",
      }),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toBe("Valid email is required");
  });

  it("should return 400 if password is missing", async () => {
    const response = await POST(
      createRequest({
        name: "John",
        email: "test@test.com",
      }),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toBe("Password must be at least 8 characters");
  });

  it("should return 400 if password is shorter than 8 characters", async () => {
    const response = await POST(
      createRequest({
        name: "John",
        email: "test@test.com",
        password: "pass12",
      }),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toBe("Password must be at least 8 characters");
  });

  it("should return 409 if email already exists", async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: "u1",
    });

    const response = await POST(
      createRequest({
        name: "John",
        email: "test@test.com",
        password: "password123",
      }),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(409);
    expect(body.message).toBe("Email already in use");

    expect(mockPrisma.user.create).not.toHaveBeenCalled();
    expect(mockSendVerificationEmail).not.toHaveBeenCalled();
  });
});
