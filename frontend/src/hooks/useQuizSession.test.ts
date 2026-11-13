import { formatCountdown } from "./useQuizSession";

describe("formatCountdown", () => {
  it.each([
    [25 * 60_000, "25:00"],
    [24 * 60_000 + 5_000, "24:05"],
    [59_000, "0:59"],
    [400, "0:01"], // rounds up so it never shows 0:00 before time is actually up
    [0, "0:00"],
    [62 * 60_000 + 5_000, "1:02:05"],
  ])("%i ms → %s", (ms, label) => expect(formatCountdown(ms)).toBe(label));
});
