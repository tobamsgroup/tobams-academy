import { ACCESS_PERIOD_DAYS, accessExpiresAt, isAccessActive } from "./enrollment-access";

describe("enrollment access", () => {
  const now = new Date("2026-11-14T12:00:00Z");

  it("lasts 180 days", () => {
    expect(ACCESS_PERIOD_DAYS).toBe(180);
    expect(accessExpiresAt(now).toISOString()).toBe("2027-05-13T12:00:00.000Z");
  });

  it("is active until the expiry moment, and unlimited when no expiry is set", () => {
    expect(isAccessActive({ expiresAt: new Date("2026-11-14T12:00:01Z") }, now)).toBe(true);
    expect(isAccessActive({ expiresAt: new Date("2026-11-14T12:00:00Z") }, now)).toBe(false);
    expect(isAccessActive({ expiresAt: "2026-01-01T00:00:00Z" }, now)).toBe(false);
    expect(isAccessActive({ expiresAt: null }, now)).toBe(true);
    expect(isAccessActive(null, now)).toBe(false);
  });
});
