/** Password requirements for new passwords (sign up, reset, change). Front-end only. */
export const PASSWORD_RULES = [
  { id: 'length', label: 'At least 8 characters', test: (pw: string) => pw.length >= 8 },
  { id: 'number', label: 'At least one number (0–9)', test: (pw: string) => /\d/.test(pw) },
  {
    id: 'special',
    label: 'At least one special character (e.g. ! @ # $ %)',
    test: (pw: string) => /[^A-Za-z0-9\s]/.test(pw),
  },
] as const

export function isStrongPassword(password: string): boolean {
  return PASSWORD_RULES.every((rule) => rule.test(password))
}

/** Message listing what's still missing, or null when the password meets every rule. */
export function passwordProblem(password: string): string | null {
  const missing = PASSWORD_RULES.filter((rule) => !rule.test(password)).map((rule) => rule.label.toLowerCase())
  return missing.length ? `Password needs ${missing.join(', ')}.` : null
}
