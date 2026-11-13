/** Emails are stored trimmed and lower-case; normalise anything a user types the same way. */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}
