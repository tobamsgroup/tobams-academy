import { notFound } from "next/navigation";
import PaymentSummaryView from "@/components/dashboard/payment/PaymentSummaryView";
import { getPaymentSummary } from "@/components/dashboard/payment/payments-data";

export default async function DashboardPaymentSummaryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const summary = getPaymentSummary(id);
  if (!summary) notFound();

  return (
    <div className="bg-[#FAFDFF] px-4 py-5 md:p-8">
      <PaymentSummaryView summary={summary} />
    </div>
  );
}
