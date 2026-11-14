/** "Free" for zero, otherwise pounds without trailing ".00": £299, £49.50. */
export function formatGbp(amount: number): string {
  if (amount <= 0) return 'Free'
  return `£${Number.isInteger(amount) ? amount : amount.toFixed(2)}`
}

/** Exact pounds for receipts and payment history: £299.00, £0.00. */
export function formatGbpExact(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}
