"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ICONS } from "@/assets/icons";
import PaymentsTable, { type ActionMenuPosition } from "./PaymentsTable";
import DeletePaymentConfirmModal from "./DeletePaymentConfirmModal";
import PaymentDeletedSuccessModal from "./PaymentDeletedSuccessModal";
import {
  DATE_RANGE_OPTIONS,
  PAGE_SIZE,
  type DateRangeFilter,
} from "./payments-data";
import { usePayments } from "@/hooks/usePayments";

export default function PaymentsDashboard() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<DateRangeFilter>("all");
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [dateMenuOpen, setDateMenuOpen] = useState(false);
  const [actionMenu, setActionMenu] = useState<ActionMenuPosition | null>(null);
  const [deleteModalPaymentId, setDeleteModalPaymentId] = useState<string | null>(null);
  const [deleteSuccessOpen, setDeleteSuccessOpen] = useState(false);
  const statusRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);

  const { payments, meta, isLoading, deletePayment } = usePayments({
    page: currentPage,
    limit: PAGE_SIZE,
    courseName: searchQuery.trim() || undefined,
    status: statusFilter,
    range: dateFilter,
  });

  const actionPayment = useMemo(
    () => (actionMenu ? payments.find((p) => p.id === actionMenu.paymentId) : undefined),
    [actionMenu, payments]
  );

  const totalPages = meta?.totalPages ?? 1;
  const safePage = Math.min(currentPage, totalPages);

  const dateFilterLabel =
    DATE_RANGE_OPTIONS.find((o) => o.value === dateFilter)?.label ?? "All dates";

  useEffect(() => {
    setCurrentPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      const t = e.target as Node;
      if (statusRef.current && !statusRef.current.contains(t)) setStatusMenuOpen(false);
      if (dateRef.current && !dateRef.current.contains(t)) setDateMenuOpen(false);
      const el = e.target;
      if (
        el instanceof Element &&
        !el.closest("[data-payment-kebab]") &&
        !el.closest("[data-payment-row-menu]")
      ) {
        setActionMenu(null);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    if (!actionMenu) return;
    const close = () => setActionMenu(null);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [actionMenu]);

  const handleExport = () => {
    console.log("Exporting payment history...", payments.length, "rows");
  };

  const statusAriaLabel =
    statusFilter === "all"
      ? "Filter by payment status. Showing all statuses."
      : `Filter by payment status. ${statusFilter} only.`;
  const dateAriaLabel =
    dateFilter === "all"
      ? "Filter by payment date. Showing all dates."
      : `Filter by payment date. ${dateFilterLabel}.`;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 grid grid-cols-1 gap-4 md:mb-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-x-6 md:gap-y-6">
        <button
          type="button"
          onClick={handleExport}
          className="row-start-1 flex w-full items-center justify-center gap-2 rounded-lg bg-[#303869] px-6 py-3 text-white transition-colors hover:bg-slate-800 md:col-start-2 md:row-start-1 md:w-auto md:justify-self-end"
        >
          <ICONS.PaymentUpload className="shrink-0" stroke="currentColor" />
          Export History
        </button>

        <div className="row-start-3 w-full md:col-start-1 md:row-start-1 md:max-w-lg">
          <div className="flex min-h-12 items-stretch overflow-hidden rounded-lg border border-[#D3D2D3] bg-white transition-[box-shadow] focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-0">
            <div className="relative min-w-0 flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 hidden items-center pl-4 md:flex">
                <ICONS.PaymentSearch className="h-5 w-5 text-gray-400" stroke="currentColor" />
              </div>
              <input
                type="search"
                placeholder="Search courses by name, ID"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-12 w-full min-w-0 border-0 bg-transparent py-3 pl-4 pr-2 text-[#221D23] outline-none placeholder:text-[#6C686C] md:pl-12 md:pr-4"
              />
            </div>
            <div
              className="my-2.5 w-px shrink-0 self-stretch bg-[#D3D2D3] md:hidden"
              aria-hidden
            />
            <button
              type="button"
              className="m-1.5 flex w-11 shrink-0 items-center justify-center rounded-md bg-[#303869] text-white md:hidden"
              aria-label="Search payments"
            >
              <ICONS.PaymentSearch className="h-5 w-5" stroke="currentColor" />
            </button>
          </div>
        </div>

        <h2 className="row-start-2 font-medium text-[#221D23] md:col-start-1 md:row-start-2">
          All Payments ({meta?.total ?? payments.length})
        </h2>

        <div
          className="row-start-4 grid grid-cols-2 gap-4 md:col-start-2 md:row-start-2 md:flex md:flex-wrap md:justify-end md:gap-3"
        >
          <div className="relative min-w-0" ref={statusRef}>
            <button
              type="button"
              aria-label={statusAriaLabel}
              aria-expanded={statusMenuOpen}
              aria-haspopup="listbox"
              onClick={() => {
                setStatusMenuOpen((o) => !o);
                setDateMenuOpen(false);
                setActionMenu(null);
              }}
              className={`flex w-full min-w-0 items-center gap-2 rounded-lg border p-4 transition-colors hover:bg-gray-50 md:w-auto md:px-4 ${
                statusFilter !== "all"
                  ? "border-[#303869] bg-[#303869]/10"
                  : "border-gray-300"
              }`}
            >
              <ICONS.PaymentFlash className="h-5 w-5 shrink-0 text-gray-600" stroke="currentColor" />
              <span className="font-medium text-gray-700">Status</span>
              <svg
                className="ml-auto h-4 w-4 shrink-0 text-gray-500 md:ml-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {statusMenuOpen ? (
              <ul
                className="absolute left-0 right-0 z-30 mt-2 min-w-[200px] overflow-hidden rounded-xl border border-[#E5E7EB] bg-white py-2 shadow-lg md:left-auto md:right-0"
                role="listbox"
              >
                {(["all", "Completed", "Pending", "Failed"] as const).map((opt) => (
                  <li key={opt}>
                    <button
                      type="button"
                      role="option"
                      className={`w-full px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-gray-50 ${
                        (opt === "all" ? statusFilter === "all" : statusFilter === opt)
                          ? "bg-gray-50 text-[#221D23]"
                          : "text-[#221D23]"
                      }`}
                      onClick={() => {
                        setStatusFilter(opt === "all" ? "all" : opt);
                        setStatusMenuOpen(false);
                        setCurrentPage(1);
                      }}
                    >
                      {opt === "all" ? "All statuses" : opt}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="relative min-w-0" ref={dateRef}>
            <button
              type="button"
              aria-label={dateAriaLabel}
              aria-expanded={dateMenuOpen}
              aria-haspopup="listbox"
              onClick={() => {
                setDateMenuOpen((o) => !o);
                setStatusMenuOpen(false);
                setActionMenu(null);
              }}
              className={`flex w-full min-w-0 items-center gap-2 rounded-lg border px-4 py-4 transition-colors hover:bg-gray-50 md:w-auto md:px-4 ${
                dateFilter !== "all"
                  ? "border-[#303869] bg-[#303869]/10"
                  : "border-gray-300"
              }`}
            >
              <ICONS.PaymentDate className="h-5 w-5 shrink-0 text-gray-600" stroke="currentColor" />
              <span className="font-medium text-gray-700">Date</span>
              <svg
                className="ml-auto h-4 w-4 shrink-0 text-gray-500 md:ml-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {dateMenuOpen ? (
              <ul
                className="absolute left-0 right-0 z-30 mt-2 max-h-[min(70vh,320px)] min-w-[200px] overflow-y-auto rounded-xl border border-[#E5E7EB] bg-white py-2 shadow-lg md:left-auto md:right-0"
                role="listbox"
              >
                {DATE_RANGE_OPTIONS.map((opt) => (
                  <li key={opt.value}>
                    <button
                      type="button"
                      role="option"
                      className={`w-full px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-gray-50 ${
                        dateFilter === opt.value ? "bg-gray-50 text-[#221D23]" : "text-[#221D23]"
                      }`}
                      onClick={() => {
                        setDateFilter(opt.value);
                        setDateMenuOpen(false);
                        setCurrentPage(1);
                      }}
                    >
                      {opt.label}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>

      {isLoading ? (
        <p className="text-[#474348]">Loading payments…</p>
      ) : (
        <PaymentsTable
          rows={payments}
          totalPages={totalPages}
          safePage={safePage}
          onPageChange={setCurrentPage}
          actionMenu={actionMenu}
          actionPayment={actionPayment}
          onCloseActionMenu={() => setActionMenu(null)}
          onRowMenuButtonClick={(e, paymentId) => {
            const r = e.currentTarget.getBoundingClientRect();
            setActionMenu((prev) =>
              prev?.paymentId === paymentId
                ? null
                : {
                    paymentId,
                    top: r.bottom + 4,
                    right: window.innerWidth - r.right,
                  }
            );
            setStatusMenuOpen(false);
            setDateMenuOpen(false);
          }}
          onViewDetails={(paymentId) => {
            router.push(`/dashboard/payment/${paymentId}`);
          }}
          onRequestDelete={(paymentId) => {
            setActionMenu(null);
            setDeleteModalPaymentId(paymentId);
          }}
        />
      )}

      <DeletePaymentConfirmModal
        isOpen={deleteModalPaymentId !== null}
        onCancel={() => setDeleteModalPaymentId(null)}
        onConfirm={() => {
          if (!deleteModalPaymentId) return;
          void deletePayment(deleteModalPaymentId).then(() => {
            setDeleteModalPaymentId(null);
            setDeleteSuccessOpen(true);
          });
        }}
      />

      <PaymentDeletedSuccessModal isOpen={deleteSuccessOpen} onClose={() => setDeleteSuccessOpen(false)} />
    </div>
  );
}
