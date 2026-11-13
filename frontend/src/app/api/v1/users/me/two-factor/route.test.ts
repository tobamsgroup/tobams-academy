import { PATCH } from "./route";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/with-auth";
import { comparePassword } from "@/lib/auth-helpers";

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

const mockPrisma = prisma as unknown as {
  user: {
    findUnique: jest.Mock;
    update: jest.Mock;
  };
};

const mockAuth = getAuthUser as jest.Mock;
const mockComparePassword = comparePassword as jest.Mock;

const user = {
  id: "u1",
  email: "test@test.com",
  passwordHash: "hashed-password",
  role: "LEARNER",
  twoFactorEnabled: false,
};

const createRequest = (body?: Record<string, unknown>) => {
  return new NextRequest("http://localhost/api/v1/users/me/two-factor", {
    method: "PATCH",
    body: body ? JSON.stringify(body) : undefined,
  });
};

describe("PATCH /api/v1/users/me/two-factor", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should enable two-factor authentication", async () => {
    mockAuth.mockReturnValue(user);

    mockPrisma.user.findUnique.mockResolvedValue(user);

    mockComparePassword.mockResolvedValue(true);

    mockPrisma.user.update.mockResolvedValue({
      ...user,
      twoFactorEnabled: true,
    });

    const response = await PATCH(
      createRequest({
        password: "password123",
        enable: true,
      }),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data).toEqual({
      twoFactorEnabled: true,
    });

    expect(body.message).toBe("Two-factor authentication enabled");

    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: "u1" },
      data: { twoFactorEnabled: true },
    });
  });

  it("should return 401 when user is not authenticated", async () => {
    mockAuth.mockReturnValue(null);

    const response = await PATCH(
      createRequest({
        password: "password123",
        enable: true,
      }),
      {},
    );

    expect(response.status).toBe(401);

    expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
  });

  it("should return 400 when password is missing", async () => {
    mockAuth.mockReturnValue(user);

    const response = await PATCH(
      createRequest({
        enable: true,
      }),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toBe("Password is required");
  });

  it("should return 400 when password is not a string", async () => {
    mockAuth.mockReturnValue(user);

    const response = await PATCH(
      createRequest({
        password: 123,
        enable: true,
      }),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toBe("Password is required");
  });

  it("should return 400 when enable is not a boolean", async () => {
    mockAuth.mockReturnValue(user);

    const response = await PATCH(
      createRequest({
        password: "password123",
        enable: "true",
      }),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toBe("enable must be a boolean");
  });

  it("should return 404 when user does not exist", async () => {
    mockAuth.mockReturnValue(user);

    mockPrisma.user.findUnique.mockResolvedValue(null);

    const response = await PATCH(
      createRequest({
        password: "password123",
        enable: true,
      }),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.message).toBe("User not found");
  });

  it("should return 401 when password is incorrect", async () => {
    mockAuth.mockReturnValue(user);

    mockPrisma.user.findUnique.mockResolvedValue(user);

    mockComparePassword.mockResolvedValue(false);

    const response = await PATCH(
      createRequest({
        password: "wrong-password",
        enable: true,
      }),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.message).toBe("Incorrect password");

    expect(mockPrisma.user.update).not.toHaveBeenCalled();
  });

  it("should return already enabled when no change is needed", async () => {
    mockAuth.mockReturnValue(user);

    mockPrisma.user.findUnique.mockResolvedValue({
      ...user,
      twoFactorEnabled: true,
    });

    mockComparePassword.mockResolvedValue(true);

    const response = await PATCH(
      createRequest({
        password: "password123",
        enable: true,
      }),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data).toEqual({
      twoFactorEnabled: true,
    });

    expect(body.message).toBe("Two-factor authentication is already enabled");

    expect(mockPrisma.user.update).not.toHaveBeenCalled();
  });

  it("should return already disabled when no change is needed", async () => {
    mockAuth.mockReturnValue(user);

    mockPrisma.user.findUnique.mockResolvedValue({
      ...user,
      twoFactorEnabled: false,
    });

    mockComparePassword.mockResolvedValue(true);

    const response = await PATCH(
      createRequest({
        password: "password123",
        enable: false,
      }),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data).toEqual({
      twoFactorEnabled: false,
    });

    expect(body.message).toBe("Two-factor authentication is already disabled");

    expect(mockPrisma.user.update).not.toHaveBeenCalled();
  });
});
