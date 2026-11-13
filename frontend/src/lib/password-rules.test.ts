import { isStrongPassword, passwordProblem } from "./password-rules";

describe("password rules", () => {
  it.each([
    ["abc!1", false], // too short
    ["abcdefgh!", false], // no number
    ["abcdefgh1", false], // no special character
    ["abcdef 12", false], // a space is not a special character
    ["abcdefg1!", true],
    ["P@ssw0rd", true],
  ])("%s → %s", (pw, ok) => expect(isStrongPassword(pw)).toBe(ok));

  it("explains what is missing", () => {
    expect(passwordProblem("abcdefgh")).toBe(
      "Password needs at least one number (0–9), at least one special character (e.g. ! @ # $ %).",
    );
    expect(passwordProblem("abcdefg1!")).toBeNull();
  });
});
