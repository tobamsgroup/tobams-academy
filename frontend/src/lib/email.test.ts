import { normalizeEmail } from "./email";

it("normalises typed emails to the stored form", () => {
  expect(normalizeEmail("  Mobolaji.Oginni@TobamsGroup.com ")).toBe("mobolaji.oginni@tobamsgroup.com");
});
