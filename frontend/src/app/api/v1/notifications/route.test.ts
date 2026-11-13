import { GET, DELETE } from "./route";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/with-auth";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    notification: {
      findMany: jest.fn(),
      deleteMany: jest.fn(),
    },
  },
}));

jest.mock("@/lib/with-auth", () => ({
  getAuthUser: jest.fn(),
}));

const mockPrisma = prisma as unknown as {
  notification: {
    findMany: jest.Mock;
    deleteMany: jest.Mock;
  };
};

const mockAuth = getAuthUser as jest.Mock;

const user = {
  id: "u1",
  email: "test@example.com",
  role: "LEARNER",
};

const mockNotifications = [
  {
    id: "n1",
    title: "Notification 1",
    userId: "u1",
    message: "notification message 1",
    type: "enrollment",
    isRead: false,
    createdAt: new Date(),
  },
  {
    id: "n2",
    title: "Notification 2",
    userId: "u1",
    message: "notification message 2",
    type: "system",
    isRead: true,
    createdAt: new Date(),
  },
];

const createRequest = (
  method: string,
  url = "http://localhost/api/v1/notifications",
  body?: object,
) => {
  return new NextRequest(url, {
    method,
    body: body ? JSON.stringify(body) : undefined,
  });
};

describe("GET /api/v1/notifications", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should return a list of notifications for the authenticated user", async () => {
    mockAuth.mockReturnValue(user);
    mockPrisma.notification.findMany.mockResolvedValue(mockNotifications);

    const response = await GET(createRequest("GET"), {});
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.length).toBe(2);
    expect(body.data[0]).toEqual(
      expect.objectContaining({
        id: "n1",
        title: "Notification 1",
        message: "notification message 1",
        isRead: false,
      }),
    );
  });
  it("should return 401 if the user is not authenticated", async () => {
    mockAuth.mockReturnValue(null);
    const response = await GET(createRequest("GET"), {});
    expect(response.status).toBe(401);
  });
  it("should return 400 if the filter query parameter is invalid", async () => {
    mockAuth.mockReturnValue(user);
    const response = await GET(
      createRequest(
        "GET",
        "http://localhost/api/v1/notifications?filter=invalid",
      ),
      {},
    );
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.message).toBe("filter must be all, read, or unread");
  });
  it("should return notifications based on the filter query parameter", async () => {
    mockAuth.mockReturnValue(user);

    mockPrisma.notification.findMany.mockResolvedValue([mockNotifications[1]]);

    const response = await GET(
      createRequest("GET", "http://localhost/api/v1/notifications?filter=read"),
      {},
    );

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.data.length).toBe(1);
    expect(body.data[0].isRead).toBe(true);
    expect(mockPrisma.notification.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          userId: "u1",
          isRead: true,
        },
      }),
    );
  });
});

describe("DELETE /api/v1/notifications", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should delete notifications for the authenticated user", async () => {
    mockAuth.mockReturnValue(user);
    mockPrisma.notification.deleteMany.mockResolvedValue({ count: 2 });
    const response = await DELETE(
      createRequest("DELETE", "http://localhost/api/v1/notifications", {
        ids: ["n1", "n2"],
      }),
      {},
    );
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.data.deleted).toBe(2);
    expect(body.message).toBe("2 notifications deleted");
    expect(mockPrisma.notification.deleteMany).toHaveBeenCalledWith({
      where: { id: { in: ["n1", "n2"] }, userId: "u1" },
    });
  });
  it("should return 401 if the user is not authenticated", async () => {
    mockAuth.mockReturnValue(null);
    const response = await DELETE(
      createRequest("DELETE", "http://localhost/api/v1/notifications", {
        ids: ["n1", "n2"],
      }),
      {},
    );
    expect(response.status).toBe(401);
  });
  it("should return 400 if ids is not a non-empty array", async () => {
    mockAuth.mockReturnValue(user);
    const response = await DELETE(
      createRequest("DELETE", "http://localhost/api/v1/notifications", {
        ids: [],
      }),
      {},
    );
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.message).toBe("ids must be a non-empty array");
  });
  it("should return 400 if any id is not a string", async () => {
    mockAuth.mockReturnValue(user);
    const response = await DELETE(
      createRequest("DELETE", "http://localhost/api/v1/notifications", {
        ids: ["n1", 123],
      }),
      {},
    );
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.message).toBe("All ids must be strings");
  });
});
