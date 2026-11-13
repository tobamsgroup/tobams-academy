/** "Free" for zero, otherwise pounds without trailing ".00": £299, £49.50. */
export function formatGbp(amount: number): string {
  if (amount <= 0) return 'Free'
  return `£${Number.isInteger(amount) ? amount : amount.toFixed(2)}`
}
