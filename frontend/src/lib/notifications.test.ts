import { notify } from "./notifications";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    notificationPreference: { findUnique: jest.fn() },
    notification: { create: jest.fn() },
  },
}));

jest.mock("@/lib/logger", () => ({
  logger: { error: jest.fn(), info: jest.fn(), warn: jest.fn() },
}));

const mockPrisma = prisma as unknown as {
  notificationPreference: { findUnique: jest.Mock };
  notification: { create: jest.Mock };
};

describe("notify", () => {
  beforeEach(() => jest.clearAllMocks());

  it("creates a notification when the user has no saved preferences", async () => {
    mockPrisma.notificationPreference.findUnique.mockResolvedValue(null);

    await notify("u1", { title: "Hi", message: "Hello", type: "ENROLLMENT", category: "enrollmentConfirm" });

    expect(mockPrisma.notification.create).toHaveBeenCalledWith({
      data: { userId: "u1", title: "Hi", message: "Hello", type: "ENROLLMENT" },
    });
  });

  it("skips the notification when the user turned that in-app category off", async () => {
    mockPrisma.notificationPreference.findUnique.mockResolvedValue({ enrollmentConfirmInApp: false });

    await notify("u1", { title: "Hi", message: "Hello", category: "enrollmentConfirm" });

    expect(mockPrisma.notification.create).not.toHaveBeenCalled();
  });

  it("always delivers notifications without a category (security alerts, receipts)", async () => {
    await notify("u1", { title: "Password changed", message: "..." });

    expect(mockPrisma.notificationPreference.findUnique).not.toHaveBeenCalled();
    expect(mockPrisma.notification.create).toHaveBeenCalledWith({
      data: { userId: "u1", title: "Password changed", message: "...", type: "SYSTEM" },
    });
  });

  it("never throws, so a failed notification cannot break the calling action", async () => {
    mockPrisma.notification.create.mockRejectedValue(new Error("db down"));

    await expect(notify("u1", { title: "x", message: "y" })).resolves.toBeUndefined();
  });
});
