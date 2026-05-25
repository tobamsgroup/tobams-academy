import Link from "next/link";
import type { ReactNode } from "react";
import { ICONS } from "@/assets/icons";
import { formatPaymentDateUs, formatUsd, type PaymentSummary } from "./payments-data";
import { ChevronRight } from "lucide-react";

function summaryStatusBadgeClass(label: string) {
  if (label === "Successful") return "bg-[#DBEFDC] text-[#099137]";
  if (label === "Pending") return "bg-[#1671D91A] text-[#303869]";
  return "bg-[#DE21211A] text-[#DE2121]";
}

function infoRow(label: string, value: ReactNode) {
  return (
    <div className="flex items-center justify-between gap-4  py-2">
      <span className="text-heading">{label}</span>
      <span className="text-right text-sm font-medium text-[#221D23]">{value}</span>
    </div>
  );
}

export default function PaymentSummaryView({ summary }: { summary: PaymentSummary }) {
  return (
    <div className="mx-auto max-w-6xl">
      <nav className="mb-6 text-[#6C686C] hidden md:flex items-center gap-2" aria-label="Breadcrumb">
        <Link href="/dashboard/payment" className="text-[#303869] hover:underline">
          Payment History
        </Link>
        <ChevronRight className="w-4 h-4 text-heading" />
        <span className="font-medium text-[#221D23]">Payment Summary</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <section className="rounded-[12px] border border-[#D3D2D366] bg-white p-5">
            <h2 className="mb-1 text-base md:text-[20px] font-medium text-[#221D23]">Payment Information</h2>
            <div className="mt-4">
              {infoRow("Course ID", summary.courseId)}
              {infoRow("Payment Date", formatPaymentDateUs(summary.date))}
              {infoRow("Payment Method", summary.paymentMethod)}
              {infoRow("Transaction ID", summary.transactionId)}
              <div className="flex items-center justify-between gap-4 py-3">
                <span className="text-sm text-[#6C686C]">Payment Status</span>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${summaryStatusBadgeClass(
                    summary.paymentStatusLabel
                  )}`}
                >
                  {summary.paymentStatusLabel}
                </span>
              </div>
            </div>
          </section>

          <section className="rounded-[12px] border border-[#D3D2D366] bg-white p-5">
            <h2 className="mb-4 text-base md:text-[20px] font-medium text-[#221D23]">Course Details</h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-[#6C686C]">Course Title</dt>
                <dd className="mt-1 text-[#221D23]">{summary.courseTitleFull}</dd>
              </div>
              <div>
                <dt className="text-[#6C686C]">Instructor</dt>
                <dd className="mt-1  text-[#221D23]">{summary.instructor}</dd>
              </div>
              <div>
                <dt className="text-[#6C686C]">Duration</dt>
                <dd className="mt-1  text-[#221D23]">{summary.duration}</dd>
              </div>
              <div>
                <dt className="text-[#6C686C]">Access Period</dt>
                <dd className="mt-1  text-[#221D23]">{summary.accessPeriod}</dd>
              </div>
            </dl>
          </section>
        </div>

        <div className="flex flex-col gap-6">
          <section className="rounded-[12px] border border-[#D3D2D366] bg-white p-5">
            <h2 className="mb-1 text-base md:text-[20px] font-medium text-[#221D23]">Cost Overview</h2>
            <div className="mt-4">
              <div className="flex items-center justify-between gap-4  py-2">
                <span className="text-[#6C686C]">Course Price</span>
                <span className="text-[#221D23]">{formatUsd(summary.coursePriceUsd)}</span>
              </div>
              <div className="flex items-center justify-between gap-4  py-3">
                <span className="text-[#099137]">Discount Applied</span>
                <span className="text-[#099137]">
                  {summary.discountUsd > 0 ? `-${formatUsd(summary.discountUsd)}` : formatUsd(0)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 pt-10">
                <span className="text-lg font-medium text-[#221D23]">Total Paid</span>
                <span className="text-lg font-medium text-[#221D23]">{formatUsd(summary.totalPaidUsd)}</span>
              </div>
            </div>
          </section>

          <section className="rounded-[12px] border border-[#D3D2D366] bg-white p-5 ">
            <h2 className="mb-4 text-base md:text-[20px] font-medium text-[#221D23]">Payment Receipt</h2>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-3 rounded-lg border border-[#D3D2D366]  px-4 py-3 text-left transition-colors hover:bg-[#F0F4F8]"
            >
              <span className="flex items-center gap-2  font-medium text-[#303869]">
                <ICONS.PaymentUpload className=" shrink-0 text-[#303869]" stroke="currentColor" />
                Download Receipt
              </span>
              <span className=" text-[#6C686C]">Pdf</span>
            </button>
          </section>

          <section className=" p-5 ">
            <h2 className="mb-3 text-base md:text-lg  text-[#221D23]">Need Help?</h2>
            <Link href="/dashboard/support" className="text-[#303869] hover:underline">
              Visit the Help Center
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
