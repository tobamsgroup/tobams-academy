import { POST } from "./route";
import { verifyRefreshToken, signTokens } from "@/lib/jwt";
import { NextRequest } from "next/server";

jest.mock("@/lib/jwt", () => ({
  verifyRefreshToken: jest.fn(),
  signTokens: jest.fn(),
}));

const mockVerifyRefreshToken = verifyRefreshToken as jest.Mock;
const mockSignTokens = signTokens as jest.Mock;

const createRequest = (authorization?: string) =>
  new NextRequest("http://localhost/api/v1/auth/refresh", {
    method: "POST",
    headers: authorization
      ? {
          authorization,
        }
      : undefined,
  });

describe("POST /api/v1/auth/refresh", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should refresh tokens successfully", async () => {
    mockVerifyRefreshToken.mockReturnValue({
      sub: "u1",
      email: "test@test.com",
      role: "LEARNER",
    });

    mockSignTokens.mockReturnValue({
      accessToken: "new-access-token",
      refreshToken: "new-refresh-token",
    });

    const response = await POST(
      createRequest("Bearer valid-refresh-token"),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data).toEqual({
      accessToken: "new-access-token",
      refreshToken: "new-refresh-token",
    });

    expect(body.message).toBe("Tokens refreshed");

    expect(mockVerifyRefreshToken).toHaveBeenCalledWith("valid-refresh-token");

    expect(mockSignTokens).toHaveBeenCalledWith(
      "u1",
      "test@test.com",
      "LEARNER",
    );
  });

  it("should return 401 when authorization header is missing", async () => {
    const response = await POST(createRequest(), {});

    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.message).toBe("Refresh token required");

    expect(mockVerifyRefreshToken).not.toHaveBeenCalled();
    expect(mockSignTokens).not.toHaveBeenCalled();
  });

  it("should return 401 when authorization header is not a Bearer token", async () => {
    const response = await POST(createRequest("Basic abc123"), {});

    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.message).toBe("Refresh token required");

    expect(mockVerifyRefreshToken).not.toHaveBeenCalled();
    expect(mockSignTokens).not.toHaveBeenCalled();
  });

  it("should return 401 when refresh token is invalid", async () => {
    mockVerifyRefreshToken.mockReturnValue(null);

    const response = await POST(createRequest("Bearer invalid-token"), {});

    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.message).toBe("Invalid or expired refresh token");

    expect(mockVerifyRefreshToken).toHaveBeenCalledWith("invalid-token");

    expect(mockSignTokens).not.toHaveBeenCalled();
  });
});
