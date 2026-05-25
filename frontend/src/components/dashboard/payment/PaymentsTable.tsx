"use client";

import type { MouseEvent } from "react";
import { ExternalLink, Trash2 } from "lucide-react";
import type { Payment } from "./payments-data";
import { ICONS } from "@/assets/icons";

export type ActionMenuPosition = {
  paymentId: string;
  top: number;
  right: number;
};

function getStatusColor(status: string) {
  switch (status) {
    case "Completed":
      return "bg-[#DBEFDC] text-[#099137]";
    case "Pending":
      return "bg-[#1671D91A] text-[#303869]";
    case "Failed":
      return "bg-[#DE21211A] text-[#DE2121]";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function formatAmount(amount: number | "Free") {
  if (amount === "Free") return "Free";
  return amount.toLocaleString();
}

/** DD-MM-YY for mobile cards */
function formatDisplayDate(isoDate: string) {
  const d = new Date(`${isoDate}T12:00:00`);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  return `${dd}-${mm}-${yy}`;
}

function buildPageItems(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages = new Set<number>();
  pages.add(1);
  pages.add(total);
  for (let p = current - 1; p <= current + 1; p++) {
    if (p >= 1 && p <= total) pages.add(p);
  }
  const sorted = [...pages].sort((a, b) => a - b);
  const out: (number | "ellipsis")[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i]! - sorted[i - 1]! > 1) out.push("ellipsis");
    out.push(sorted[i]!);
  }
  return out;
}

type PaymentsTableProps = {
  rows: Payment[];
  totalPages: number;
  safePage: number;
  onPageChange: (page: number | ((prev: number) => number)) => void;
  actionMenu: ActionMenuPosition | null;
  actionPayment: Payment | undefined;
  onCloseActionMenu: () => void;
  onRowMenuButtonClick: (e: MouseEvent<HTMLButtonElement>, paymentId: string) => void;
  onViewDetails: (paymentId: string) => void;
  onRequestDelete: (paymentId: string) => void;
};

export default function PaymentsTable({
  rows,
  totalPages,
  safePage,
  onPageChange,
  actionMenu,
  actionPayment,
  onCloseActionMenu,
  onRowMenuButtonClick,
  onViewDetails,
  onRequestDelete,
}: PaymentsTableProps) {
  return (
    <div>
      <div className="space-y-4 md:hidden">
        {rows.length === 0 ? (
          <div className="rounded-xl border border-[#D3D2D366] bg-white px-4 py-12 text-center text-sm text-gray-500">
            No payments match your filters.
          </div>
        ) : (
          rows.map((payment) => (
            <article
              key={payment.id}
              className="overflow-hidden rounded-xl border border-[#D3D2D366] bg-white"
            >
              <div className="flex items-center justify-between gap-3 border-b border-[#D3D2D366] px-4 py-4">
                <p className="line-clamp-2 min-w-0 flex-1 text-sm font-medium text-[#221D23]">
                  {payment.courseName}
                </p>
                <button
                  type="button"
                  data-payment-kebab
                  className="flex shrink-0 items-center justify-center transition-colors hover:bg-gray-50"
                  aria-label="Row actions"
                  aria-expanded={actionMenu?.paymentId === payment.id}
                  aria-haspopup="menu"
                  onClick={(e) => onRowMenuButtonClick(e, payment.id)}
                >
                  <ICONS.PaymentMenu />
                </button>
              </div>
              <dl className="divide-y divide-[#D3D2D366]">
                <div className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                  <dt className="text-[#6C686C]">Course ID</dt>
                  <dd className="font-medium text-[#221D23]">{payment.courseId}</dd>
                </div>
                <div className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                  <dt className="text-[#6C686C]">Amount</dt>
                  <dd className="font-medium text-[#221D23]">{formatAmount(payment.amount)}</dd>
                </div>
                <div className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                  <dt className="text-[#6C686C]">Date</dt>
                  <dd className="font-medium text-[#221D23]">{formatDisplayDate(payment.date)}</dd>
                </div>
                <div className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                  <dt className="text-[#6C686C]">Status</dt>
                  <dd className="shrink-0">
                    <span
                      className={`inline-flex w-[6.75rem] justify-center rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                        payment.status
                      )}`}
                    >
                      {payment.status}
                    </span>
                  </dd>
                </div>
              </dl>
            </article>
          ))
        )}
      </div>

      <div className="hidden overflow-hidden rounded-lg border border-[#D3D2D366] bg-white md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-[#D3D2D366] bg-[#FAFDFF]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#6C686C]">Course Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#6C686C]">Course ID</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#6C686C]">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#6C686C]">Date</th>
                <th className="w-[7.5rem] px-6 py-4 text-center text-sm font-medium text-[#6C686C]">
                  Status
                </th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                    No payments match your filters.
                  </td>
                </tr>
              ) : (
                rows.map((payment) => (
                  <tr key={payment.id} className="transition-colors hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-[#221D23]">{payment.courseName}</td>
                    <td className="px-6 py-4 text-sm font-medium text-[#221D23]">{payment.courseId}</td>
                    <td className="px-6 py-4 text-sm font-medium text-[#221D23]">
                      {formatAmount(payment.amount)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-[#221D23]">{payment.date}</td>
                    <td className="px-6 py-4 text-center align-middle">
                      <span
                        className={`inline-flex w-[6.75rem] shrink-0 justify-center rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                          payment.status
                        )}`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        data-payment-kebab
                        className="inline-flex rounded-[4px] border border-[#C4C4C466] w-10 h-10 items-center justify-center transition-colors hover:text-gray-600"
                        aria-label="Row actions"
                        aria-expanded={actionMenu?.paymentId === payment.id}
                        aria-haspopup="menu"
                        onClick={(e) => onRowMenuButtonClick(e, payment.id)}
                      >
                        <ICONS.PaymentMenu />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {actionMenu && actionPayment ? (
        <div
          data-payment-row-menu
          role="menu"
          className="fixed z-50  min-w-[200px] overflow-hidden rounded-xl border border-[#E5E7EB] bg-white py-1 shadow-lg"
          style={{ top: actionMenu.top, right: actionMenu.right }}
        >
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-gray-50"
            onClick={() => {
              onCloseActionMenu();
              onViewDetails(actionPayment.id);
            }}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
              <ExternalLink className="h-4 w-4" strokeWidth={2} />
            </span>
            <span className="text-sm font-medium text-[#221D23]">View details</span>
          </button>
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-gray-50"
            onClick={() => {
              onCloseActionMenu();
              onRequestDelete(actionPayment.id);
            }}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
              <Trash2 className="h-4 w-4" strokeWidth={2} />
            </span>
            <span className="text-sm font-medium text-[#221D23]">Delete</span>
          </button>
        </div>
      ) : null}

      {totalPages > 1 ? (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 pt-6 md:justify-end">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => onPageChange((p) => Math.max(1, p - 1))}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 transition-colors hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-40"
          >
            <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {buildPageItems(safePage, totalPages).map((item, idx) =>
            item === "ellipsis" ? (
              <span key={`e-${idx}`} className="px-3 text-gray-500">
                ...
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => onPageChange(item)}
                className={`flex h-10 w-10 items-center justify-center rounded-lg font-medium transition-colors ${
                  safePage === item
                    ? "bg-[#303869] text-white"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {item}
              </button>
            )
          )}

          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => onPageChange((p) => Math.min(totalPages, p + 1))}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#6C686C] transition-colors hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-40"
          >
            <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      ) : null}
    </div>
  );
}
