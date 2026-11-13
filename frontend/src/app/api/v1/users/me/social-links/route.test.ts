import { PATCH } from "./route";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/with-auth";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      update: jest.fn(),
    },
  },
}));

jest.mock("@/lib/with-auth", () => ({
  getAuthUser: jest.fn(),
}));

const mockPrisma = prisma as unknown as {
  user: {
    update: jest.Mock;
  };
};

const mockAuth = getAuthUser as jest.Mock;

const user = {
  id: "u1",
  email: "test@test.com",
  role: "LEARNER",
  linkedinUrl: null,
  facebookUrl: null,
  instagramUrl: null,
  xUrl: null,
};

const createRequest = (body?: object) => {
  return new NextRequest("http://localhost/api/v1/users/me/social-links", {
    method: "PATCH",
    body: body ? JSON.stringify(body) : undefined,
  });
};

describe("PATCH /api/v1/users/me/social-links", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update social links for authenticated user", async () => {
    mockAuth.mockReturnValue(user);
    mockPrisma.user.update.mockResolvedValue({
      ...user,
      linkedinUrl: "https://linkedin.com/in/test",
      facebookUrl: "https://facebook.com/test",
    });

    const response = await PATCH(
      createRequest({
        linkedinUrl: "https://linkedin.com/in/test",
        facebookUrl: "https://facebook.com/test",
      }),
      {},
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.data).toEqual(
      expect.objectContaining({
        linkedinUrl: "https://linkedin.com/in/test",
        facebookUrl: "https://facebook.com/test",
        instagramUrl: null,
        xUrl: null,
      }),
    );

    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: "u1" },
      data: {
        linkedinUrl: "https://linkedin.com/in/test",
        facebookUrl: "https://facebook.com/test",
      },
      select: {
        linkedinUrl: true,
        facebookUrl: true,
        instagramUrl: true,
        xUrl: true,
      },
    });
  });

  it("should return 401 for unauthenticated user", async () => {
    mockAuth.mockReturnValue(null);

    const response = await PATCH(
      createRequest({ linkedinUrl: "https://linkedin.com/in/test" }),
      {},
    );
    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body.message).toBe("Unauthorized");
  });

  it("should return 400 if no social link fields provided", async () => {
    mockAuth.mockReturnValue(user);

    const response = await PATCH(createRequest({}), {});
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.message).toBe("No social link fields provided");
  });

  it("should return 400 if a social link field is not a string or null", async () => {
    mockAuth.mockReturnValue(user);

    const response = await PATCH(createRequest({ linkedinUrl: 123 }), {});
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.message).toBe("linkedinUrl must be a string or null");
  });

  it("should trim social links before saving", async () => {
    mockAuth.mockReturnValue(user);

    mockPrisma.user.update.mockResolvedValue({
      ...user,
      linkedinUrl: "https://linkedin.com/test",
    });

    await PATCH(
      createRequest({
        linkedinUrl: "   https://linkedin.com/test   ",
      }),
      {},
    );

    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: "u1" },
      data: {
        linkedinUrl: "https://linkedin.com/test",
      },
      select: {
        linkedinUrl: true,
        facebookUrl: true,
        instagramUrl: true,
        xUrl: true,
      },
    });
  });
});
