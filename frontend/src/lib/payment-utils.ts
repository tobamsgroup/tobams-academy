import type { PaymentStatus, PaymentDetail } from '@/types/payment'
import type { PaymentSummary } from '@/components/dashboard/payment/payments-data'

export function decimalToNumber(value: unknown): number {
  if (value == null) return 0
  if (typeof value === 'number') return value
  if (typeof value === 'string') return Number(value) || 0
  if (typeof value === 'object' && value !== null && 'toNumber' in value) {
    return (value as { toNumber: () => number }).toNumber()
  }
  return Number(value) || 0
}

export function apiStatusToUiStatus(status: PaymentStatus): 'Completed' | 'Pending' | 'Failed' {
  if (status === 'COMPLETED') return 'Completed'
  if (status === 'PENDING') return 'Pending'
  return 'Failed'
}

export function uiStatusToApiStatus(status: string): PaymentStatus | undefined {
  if (status === 'Completed') return 'COMPLETED'
  if (status === 'Pending') return 'PENDING'
  if (status === 'Failed') return 'FAILED'
  return undefined
}

export function uiDateRangeToApiRange(
  filter: string,
): 'LAST_7_DAYS' | 'LAST_30_DAYS' | 'LAST_60_DAYS' | 'LAST_90_DAYS' | undefined {
  if (filter === 'this_week') return 'LAST_7_DAYS'
  if (filter === 'last_30') return 'LAST_30_DAYS'
  if (filter === 'last_60') return 'LAST_60_DAYS'
  if (filter === 'last_90') return 'LAST_90_DAYS'
  if (filter === 'this_month') return 'LAST_30_DAYS'
  return undefined
}

export function formatDurationMinutes(totalMinutes: number): string {
  if (totalMinutes <= 0) return '—'
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours === 0) return `${minutes}min`
  if (minutes === 0) return `${hours}hrs`
  return `${hours}hrs ${minutes}min`
}

function statusToSummaryLabel(status: PaymentStatus): string {
  if (status === 'COMPLETED') return 'Successful'
  if (status === 'PENDING') return 'Pending'
  return 'Failed'
}

export function paymentDetailToSummary(paymentId: string, detail: PaymentDetail): PaymentSummary {
  const totalPaid = detail.costOverview.totalAmount
  const coursePrice = detail.costOverview.coursePrice
  const discount = Math.max(0, coursePrice - totalPaid)

  return {
    id: paymentId,
    courseId: detail.paymentDetails.courseId,
    courseName: detail.courseDetails.courseTitle,
    amount: totalPaid <= 0 ? 'Free' : totalPaid,
    date: detail.paymentDetails.paymentDate.slice(0, 10),
    status: apiStatusToUiStatus(detail.paymentDetails.status),
    paymentMethod: detail.paymentDetails.paymentMethod,
    transactionId: detail.paymentDetails.transactionId ?? '—',
    instructor: detail.courseDetails.courseInstructor,
    duration: formatDurationMinutes(detail.courseDetails.duration),
    accessPeriod: 'Lifetime',
    courseTitleFull: detail.courseDetails.courseTitle,
    paymentStatusLabel: statusToSummaryLabel(detail.paymentDetails.status),
    coursePriceUsd: coursePrice,
    discountUsd: discount,
    totalPaidUsd: totalPaid,
  }
}
