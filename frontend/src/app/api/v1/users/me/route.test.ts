import { PATCH, GET } from "./route";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/with-auth";

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

const mockPrisma = prisma as unknown as {
  user: {
    findUnique: jest.Mock;
    update: jest.Mock;
  };
};

const mockAuth = getAuthUser as jest.Mock;

const user = {
  id: "u1",
  email: "test@test.com",
  name: "Test User",
  password: "hashed-password",
  role: "LEARNER",
  emailVerified: true,
  phone: "1234567890",
  bio: "This is a test user.",
  avatarUrl: "https://example.com/avatar.jpg",
};

const createRequest = (method: string, body?: object) => {
  return new NextRequest("https://localhost:3000/api/v1/users/me", {
    method,
    body: body ? JSON.stringify(body) : undefined,
  });
};

describe("GET /api/v1/users/me", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return user data for authenticated user", async () => {
    mockAuth.mockReturnValue(user);
    mockPrisma.user.findUnique.mockResolvedValue(user);

    const response = await GET(createRequest("GET"), {});

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.data).toEqual(
      expect.objectContaining({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: user.emailVerified,
        phone: user.phone,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
      }),
    );
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: user.id },
    });
    expect(body.data).not.toHaveProperty("password");
  });
  it("should return 401 for unauthenticated user", async () => {
    mockAuth.mockReturnValue(null);

    const response = await GET(createRequest("GET"), {});

    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.message).toBe("Unauthorized");
  });
  it("should return 404 if user not found", async () => {
    mockAuth.mockReturnValue(user);
    mockPrisma.user.findUnique.mockResolvedValue(null);

    const response = await GET(createRequest("GET"), {});

    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body.message).toBe("User not found");
  });
});

describe("PATCH /api/v1/users/me", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update user profile successfully", async () => {
    mockAuth.mockReturnValue(user);
    mockPrisma.user.update.mockResolvedValue({
      ...user,
      name: "Updated Name",
      phone: "0987654321",
      bio: "Updated bio.",
      avatarUrl: "https://example.com/new-avatar.jpg",
    });

    const response = await PATCH(
      createRequest("PATCH", {
        name: "Updated Name",
        phone: "0987654321",
        bio: "Updated bio.",
        avatarUrl: "https://example.com/new-avatar.jpg",
      }),
      {},
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.data).toEqual(
      expect.objectContaining({
        id: user.id,
        email: user.email,
        name: "Updated Name",
        role: user.role,
        emailVerified: user.emailVerified,
        phone: "0987654321",
        bio: "Updated bio.",
        avatarUrl: "https://example.com/new-avatar.jpg",
      }),
    );
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: user.id },
      data: {
        name: "Updated Name",
        phone: "0987654321",
        bio: "Updated bio.",
        avatarUrl: "https://example.com/new-avatar.jpg",
      },
    });
  });

  it("should return 401 for unauthenticated user", async () => {
    mockAuth.mockReturnValue(null);
    const response = await PATCH(
      createRequest("PATCH", {
        name: "Updated Name",
      }),
      {},
    );

    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.message).toBe("Unauthorized");
  });

  it("should return error if no fields provided", async () => {
    mockAuth.mockReturnValue(user);
    const response = await PATCH(createRequest("PATCH", {}), {});

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.message).toBe("No fields provided");
  });

  it("should trim string fields before updating", async () => {
    mockAuth.mockReturnValue(user);
    mockPrisma.user.update.mockResolvedValue({
      ...user,
      name: "John",
    });
    await PATCH(
      createRequest("PATCH", {
        name: "   John   ",
      }),
      {},
    );
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: {
        id: "u1",
      },
      data: {
        name: "John",
      },
    });
  });

  it("should return error if name is empty string", async () => {
    mockAuth.mockReturnValue(user);
    const response = await PATCH(
      createRequest("PATCH", {
        name: "",
      }),
      {},
    );

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.message).toBe("Name must be a non-empty string");
  });
});
