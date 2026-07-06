import { POST } from "./route";
import { NextRequest } from "next/server";

describe("POST /api/v1/auth/logout", () => {
  it("should return 200 and a success message", async () => {
    const request = new NextRequest("http://localhost/api/v1/auth/logout", {
      method: "POST",
    });

    const response = await POST(request, {});
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.message).toBe("Logged out successfully");
    expect(body.data).toBeUndefined();
  });
});
