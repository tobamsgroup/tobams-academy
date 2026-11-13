import { POST } from "./route";
import { prisma } from "@/lib/prisma";
import { hashPassword, hashToken } from "@/lib/auth-helpers";
import { NextRequest } from "next/server";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock("@/lib/auth-helpers", () => ({
  hashPassword: jest.fn(),
  hashToken: jest.fn(),
}));

const mockPrisma = prisma as unknown as {
  user: {
    findFirst: jest.Mock;
    update: jest.Mock;
  };
};

const mockHashPassword = hashPassword as jest.Mock;
const mockHashToken = hashToken as jest.Mock;

const createRequest = (body?: object, query = "") =>
  new NextRequest(`http://localhost/api/v1/auth/reset-password${query}`, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });

const user = {
  id: "u1",
  email: "john@example.com",
  resetTokenHash: "hashed-token",
  passwordHash: "old-password-hash",
};

describe("POST /api/v1/auth/reset-password", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should reset the password successfully", async () => {
    mockHashToken.mockReturnValue("hashed-token");
    mockHashPassword.mockResolvedValue("new-password-hash");

    mockPrisma.user.findFirst.mockResolvedValue(user);

    const response = await POST(
      createRequest(
        {
          password: "newpassword123",
        },
        "?token=raw-token",
      ),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.message).toBe("Password reset successfully");

    expect(mockHashToken).toHaveBeenCalledWith("raw-token");

    expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
      where: {
        resetTokenHash: "hashed-token",
        resetTokenExpiry: {
          gt: expect.any(Date),
        },
      },
    });

    expect(mockHashPassword).toHaveBeenCalledWith("newpassword123");

    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: "u1" },
      data: {
        passwordHash: "new-password-hash",
        resetTokenHash: null,
        resetTokenExpiry: null,
      },
    });
  });

  it("should return 400 when token is missing", async () => {
    const response = await POST(
      createRequest({
        password: "newpassword123",
      }),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toBe("Token is required");

    expect(mockHashToken).not.toHaveBeenCalled();
    expect(mockPrisma.user.findFirst).not.toHaveBeenCalled();
    expect(mockPrisma.user.update).not.toHaveBeenCalled();
  });

  it("should return 400 when password is missing", async () => {
    const response = await POST(createRequest({}, "?token=raw-token"), {});

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toBe("Password must be at least 8 characters");

    expect(mockHashToken).not.toHaveBeenCalled();
    expect(mockPrisma.user.findFirst).not.toHaveBeenCalled();
  });

  it("should return 400 when password is shorter than 8 characters", async () => {
    const response = await POST(
      createRequest(
        {
          password: "1234567",
        },
        "?token=raw-token",
      ),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toBe("Password must be at least 8 characters");

    expect(mockHashToken).not.toHaveBeenCalled();
    expect(mockPrisma.user.findFirst).not.toHaveBeenCalled();
  });

  it("should return 401 when reset token is invalid or expired", async () => {
    mockHashToken.mockReturnValue("hashed-token");
    mockPrisma.user.findFirst.mockResolvedValue(null);

    const response = await POST(
      createRequest(
        {
          password: "newpassword123",
        },
        "?token=raw-token",
      ),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.message).toBe("Invalid or expired reset token");

    expect(mockHashPassword).not.toHaveBeenCalled();
    expect(mockPrisma.user.update).not.toHaveBeenCalled();
  });
});
