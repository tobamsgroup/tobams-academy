import { PATCH } from "./route";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/with-auth";
import { comparePassword, hashPassword } from "@/lib/auth-helpers";

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
  hashPassword: jest.fn(),
}));

const mockPrisma = prisma as unknown as {
  user: {
    findUnique: jest.Mock;
    update: jest.Mock;
  };
};

const mockAuth = getAuthUser as jest.Mock;
const mockComparePassword = comparePassword as jest.Mock;
const mockHashPassword = hashPassword as jest.Mock;

const authUser = {
  id: "u1",
  email: "test@test.com",
};

const dbUser = {
  id: "u1",
  email: "test@test.com",
  passwordHash: "hashed-password",
};

const createRequest = (body?: object) =>
  new NextRequest("http://localhost/api/v1/users/me/change-password", {
    method: "PATCH",
    body: body ? JSON.stringify(body) : undefined,
  });

describe("PATCH /api/v1/users/me/change-password", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should change the password successfully", async () => {
    mockAuth.mockReturnValue(authUser);

    mockPrisma.user.findUnique.mockResolvedValue(dbUser);

    mockComparePassword.mockResolvedValue(true);

    mockHashPassword.mockResolvedValue("new-hash");

    mockPrisma.user.update.mockResolvedValue({
      ...dbUser,
      passwordHash: "new-hash",
    });

    const response = await PATCH(
      createRequest({
        currentPassword: "oldPassword123",
        newPassword: "newPassword123",
      }),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.message).toBe("Password updated successfully");

    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: "u1" },
    });

    expect(mockComparePassword).toHaveBeenCalledWith(
      "oldPassword123",
      "hashed-password",
    );

    expect(mockHashPassword).toHaveBeenCalledWith("newPassword123");

    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: "u1" },
      data: {
        passwordHash: "new-hash",
      },
    });
  });

  it("should return 401 if user is not authenticated", async () => {
    mockAuth.mockReturnValue(null);

    const response = await PATCH(createRequest(), {});

    expect(response.status).toBe(401);
  });

  it("should return 400 if current password is missing", async () => {
    mockAuth.mockReturnValue(authUser);

    const response = await PATCH(
      createRequest({
        newPassword: "newPassword123",
      }),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(400);

    expect(body.message).toBe("Current password is required");
  });

  it("should return 400 if new password is missing", async () => {
    mockAuth.mockReturnValue(authUser);

    const response = await PATCH(
      createRequest({
        currentPassword: "oldPassword123",
      }),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(400);

    expect(body.message).toBe("New password must be at least 8 characters");
  });

  it("should return 400 if new password is shorter than 8 characters", async () => {
    mockAuth.mockReturnValue(authUser);

    const response = await PATCH(
      createRequest({
        currentPassword: "oldPassword123",
        newPassword: "short",
      }),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(400);

    expect(body.message).toBe("New password must be at least 8 characters");
  });

  it("should return 400 if current password and new password are the same", async () => {
    mockAuth.mockReturnValue(authUser);

    const response = await PATCH(
      createRequest({
        currentPassword: "password123",
        newPassword: "password123",
      }),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(400);

    expect(body.message).toBe("New password must differ from current password");
  });

  it("should return 404 if user is not found", async () => {
    mockAuth.mockReturnValue(authUser);

    mockPrisma.user.findUnique.mockResolvedValue(null);

    const response = await PATCH(
      createRequest({
        currentPassword: "oldPassword123",
        newPassword: "newPassword123",
      }),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(404);

    expect(body.message).toBe("User not found");
  });

  it("should return 401 if current password is incorrect", async () => {
    mockAuth.mockReturnValue(authUser);

    mockPrisma.user.findUnique.mockResolvedValue(dbUser);

    mockComparePassword.mockResolvedValue(false);

    const response = await PATCH(
      createRequest({
        currentPassword: "wrongPassword",
        newPassword: "newPassword123",
      }),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(401);

    expect(body.message).toBe("Current password is incorrect");
  });
});
