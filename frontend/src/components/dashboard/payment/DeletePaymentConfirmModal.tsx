"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

type DeletePaymentConfirmModalProps = {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeletePaymentConfirmModal({
  isOpen,
  onCancel,
  onConfirm,
}: DeletePaymentConfirmModalProps) {
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    if (isOpen) setAcknowledged(false);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4"
      role="presentation"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-payment-title"
        className="mx-4 flex w-full max-w-[327px] flex-col items-center rounded-xl bg-white p-6 text-center shadow-xl md:max-w-[564px] md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#FEE2E2]">
          <Trash2 className="h-7 w-7 text-[#DE2121]" strokeWidth={2} aria-hidden />
        </div>

        <h2 id="delete-payment-title" className="mb-2 text-lg font-semibold text-[#221D23] md:text-xl">
          Delete Payment History
        </h2>
        <p className="mb-5 text-sm leading-relaxed text-[#6C686C]">
          Deleting this payment record will remove it from your payment history. This action cannot be undone.
        </p>

        <label className="mb-6 flex w-full cursor-pointer flex items-center justify-center gap-3 text-center">
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(e) => setAcknowledged(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#D3D2D3] accent-[#DE2121] focus:ring-2 focus:ring-[#DE2121]/30 focus:ring-offset-0"
          />
          <span className="text-sm italic text-[#6C686C]">*I acknowledge that this action is irreversible.*</span>
        </label>

        <div className="flex w-full gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-lg bg-[#F3F4F6] py-3 text-sm font-medium text-[#221D23] transition-colors hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!acknowledged}
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-[#DE2121] py-3 text-sm font-medium text-white transition-colors hover:bg-[#C41E1E] disabled:pointer-events-none disabled:opacity-40"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
