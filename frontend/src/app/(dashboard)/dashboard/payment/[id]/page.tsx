import PaymentSummaryClient from '@/components/dashboard/payment/PaymentSummaryClient'

export default async function DashboardPaymentSummaryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <PaymentSummaryClient paymentId={id} />
}
