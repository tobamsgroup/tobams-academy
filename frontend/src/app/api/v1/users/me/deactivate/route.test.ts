import { POST } from "./route";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/with-auth";
import { comparePassword } from "@/lib/auth-helpers";
import { sendAccountDeactivationEmail } from "@/lib/mail";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock("@/lib/with-auth", () => ({
  getAuthUser: jest.fn(),
}));

jest.mock("@/lib/auth-helpers", () => ({
  comparePassword: jest.fn(),
}));

jest.mock("@/lib/mail", () => ({
  sendAccountDeactivationEmail: jest.fn(),
}));

const mockPrisma = prisma as unknown as {
  user: {
    findUnique: jest.Mock;
    update: jest.Mock;
  };
};

const mockAuth = getAuthUser as jest.Mock;
const mockComparePassword = comparePassword as jest.Mock;
const mockSendMail = sendAccountDeactivationEmail as jest.Mock;

const authUser = {
  id: "u1",
  email: "test@test.com",
};

const dbUser = {
  id: "u1",
  email: "test@test.com",
  name: "Tabitha",
  passwordHash: "hashed-password",
  isActive: true,
};

const createRequest = (body?: object) =>
  new NextRequest("http://localhost/api/v1/users/me/deactivate", {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });

describe("POST /api/v1/users/me/deactivate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should deactivate the account", async () => {
    mockAuth.mockReturnValue(authUser);

    mockPrisma.user.findUnique.mockResolvedValue(dbUser);

    mockComparePassword.mockResolvedValue(true);

    mockPrisma.user.update.mockResolvedValue({
      ...dbUser,
      isActive: false,
    });

    const response = await POST(
      createRequest({
        password: "password123",
        reason: "No longer needed",
      }),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.message).toBe(
      "Account deactivated. You can reactivate it by logging in again.",
    );

    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: "u1" },
      data: expect.objectContaining({
        isActive: false,
        deactivationReason: "No longer needed",
        deactivatedAt: expect.any(Date),
      }),
    });

    expect(mockSendMail).toHaveBeenCalledWith("test@test.com", "Tabitha");
    expect(mockComparePassword).toHaveBeenCalledWith(
      "password123",
      dbUser.passwordHash,
    );

    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: "u1" },
    });
  });

  it("should return 401 if user is not authenticated", async () => {
    mockAuth.mockReturnValue(null);

    const response = await POST(
      createRequest({
        password: "password123",
        reason: "No longer needed",
      }),
      {},
    );

    expect(response.status).toBe(401);
  });

  it("should return 400 if password is missing", async () => {
    mockAuth.mockReturnValue(authUser);

    const response = await POST(
      createRequest({
        reason: "No longer needed",
      }),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(400);

    expect(body.message).toBe("Password is required");
  });

  it("should return 400 if password is not a string", async () => {
    mockAuth.mockReturnValue(authUser);

    const response = await POST(
      createRequest({
        password: 123,
        reason: "No longer needed",
      }),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(400);

    expect(body.message).toBe("Password is required");
  });

  it("should return 400 if reason is missing", async () => {
    mockAuth.mockReturnValue(authUser);

    const response = await POST(
      createRequest({
        password: "password123",
      }),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(400);

    expect(body.message).toBe("A reason for deactivation is required");
  });

  it("should return 404 if user does not exist", async () => {
    mockAuth.mockReturnValue(authUser);

    mockPrisma.user.findUnique.mockResolvedValue(null);

    const response = await POST(
      createRequest({
        password: "password123",
        reason: "No longer needed",
      }),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(404);

    expect(body.message).toBe("User not found");
  });

  it("should return 409 if account is already deactivated", async () => {
    mockAuth.mockReturnValue(authUser);

    mockPrisma.user.findUnique.mockResolvedValue({
      ...dbUser,
      isActive: false,
    });

    const response = await POST(
      createRequest({
        password: "password123",
        reason: "No longer needed",
      }),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(409);

    expect(body.message).toBe("Account is already deactivated");
  });

  it("should return 401 if password is incorrect", async () => {
    mockAuth.mockReturnValue(authUser);

    mockPrisma.user.findUnique.mockResolvedValue(dbUser);

    mockComparePassword.mockResolvedValue(false);

    const response = await POST(
      createRequest({
        password: "wrong-password",
        reason: "No longer needed",
      }),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(401);

    expect(body.message).toBe("Incorrect password");
  });
});
