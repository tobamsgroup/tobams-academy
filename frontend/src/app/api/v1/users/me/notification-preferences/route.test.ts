import { GET, PATCH } from "./route";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/with-auth";
import { NextRequest } from "next/server";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    notificationPreference: {
      upsert: jest.fn(),
    },
  },
}));

jest.mock("@/lib/with-auth", () => ({
  getAuthUser: jest.fn(),
}));

const mockPrisma = prisma as unknown as {
  notificationPreference: {
    upsert: jest.Mock;
  };
};

const mockAuth = getAuthUser as jest.Mock;

const user = {
  id: "u1",
  email: "test@test.com",
  role: "LEARNER",
};

const mockPreferences = {
  userId: "u1",

  registrationSetupEmail: true,
  registrationSetupInApp: true,

  enrollmentConfirmEmail: false,
  enrollmentConfirmInApp: true,

  courseUpdatesEmail: false,
  courseUpdatesInApp: false,

  assessmentRemindersEmail: true,
  assessmentRemindersInApp: true,

  progressTrackingEmail: false,
  progressTrackingInApp: true,

  certificationAlertsEmail: true,
  certificationAlertsInApp: false,

  engagementPromptsEmail: false,
  engagementPromptsInApp: true,

  createdAt: new Date(),
  updatedAt: new Date(),
};

const createRequest = (method: string, body?: object) =>
  new NextRequest("http://localhost/api/v1/users/me/notification-preferences", {
    method,
    body: body ? JSON.stringify(body) : undefined,
  });

describe("GET /api/v1/users/me/notification-preferences", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return notification preferences", async () => {
    mockAuth.mockReturnValue(user);

    mockPrisma.notificationPreference.upsert.mockResolvedValue(mockPreferences);

    const response = await GET(createRequest("GET"), {});
    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data).toEqual(
      expect.objectContaining({
        registrationSetupEmail: true,
        enrollmentConfirmEmail: false,
        engagementPromptsInApp: true,
      }),
    );

    expect(body.data).not.toHaveProperty("createdAt");
    expect(body.data).not.toHaveProperty("updatedAt");
    expect(body.data).not.toHaveProperty("userId");

    expect(mockPrisma.notificationPreference.upsert).toHaveBeenCalledWith({
      where: { userId: "u1" },
      update: {},
      create: { userId: "u1" },
    });
  });

  it("should return 401 if user is not authenticated", async () => {
    mockAuth.mockReturnValue(null);

    const response = await GET(createRequest("GET"), {});
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.message).toBe("Unauthorized");
  });
});

describe("PATCH /api/v1/users/me/notification-preferences", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update notification preferences", async () => {
    mockAuth.mockReturnValue(user);

    mockPrisma.notificationPreference.upsert.mockResolvedValue({
      ...mockPreferences,
      registrationSetupEmail: false,
      courseUpdatesEmail: true,
    });

    const response = await PATCH(
      createRequest("PATCH", {
        registrationSetupEmail: false,
        courseUpdatesEmail: true,
      }),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.message).toBe("Preferences updated");

    expect(body.data.registrationSetupEmail).toBe(false);
    expect(body.data.courseUpdatesEmail).toBe(true);

    expect(mockPrisma.notificationPreference.upsert).toHaveBeenCalledWith({
      where: { userId: "u1" },
      update: {
        registrationSetupEmail: false,
        courseUpdatesEmail: true,
      },
      create: {
        userId: "u1",
        registrationSetupEmail: false,
        courseUpdatesEmail: true,
      },
    });
  });

  it("should return 401 if user is not authenticated", async () => {
    mockAuth.mockReturnValue(null);

    const response = await PATCH(
      createRequest("PATCH", {
        registrationSetupEmail: false,
      }),
      {},
    );

    expect(response.status).toBe(401);
  });

  it("should return 400 if body is not an object", async () => {
    mockAuth.mockReturnValue(user);

    const request = new NextRequest(
      "http://localhost/api/v1/users/me/notification-preferences",
      {
        method: "PATCH",
        body: JSON.stringify(true),
      },
    );

    const response = await PATCH(request, {});
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toBe("Request body must be a JSON object");
  });

  it("should return 400 for an unknown preference key", async () => {
    mockAuth.mockReturnValue(user);

    const response = await PATCH(
      createRequest("PATCH", {
        randomKey: true,
      }),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toBe("Unknown preference key: randomKey");
  });

  it("should return 400 when a preference value is not boolean", async () => {
    mockAuth.mockReturnValue(user);

    const response = await PATCH(
      createRequest("PATCH", {
        registrationSetupEmail: "yes",
      }),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toBe(
      'Value for "registrationSetupEmail" must be a boolean',
    );
  });

  it("should return 400 when no preference fields are provided", async () => {
    mockAuth.mockReturnValue(user);

    const response = await PATCH(createRequest("PATCH", {}), {});

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toBe("No preference fields provided");
  });
});
