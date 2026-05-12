"use client";

import { ICONS } from "@/assets/icons";

type PaymentDeletedSuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function PaymentDeletedSuccessModal({ isOpen, onClose }: PaymentDeletedSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-deleted-title"
        className="mx-4 flex w-full max-w-[327px] flex-col items-center rounded-xl bg-white p-6 text-center shadow-xl md:max-w-[564px] md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5">
          <ICONS.ProfileSuccess />
        </div>

        <h2 id="payment-deleted-title" className="mb-2 text-lg font-semibold text-[#221D23] md:text-xl">
          Payment Record Successfully Deleted!
        </h2>
        <p className="mb-6 max-w-[287px] text-sm leading-relaxed text-[#6C686C] md:max-w-none">
          The selected payment record has been deleted.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-lg bg-[#DBEFDC] py-3 text-sm font-medium text-[#099137] transition-colors hover:bg-[#C8E8CA]"
        >
          Close
        </button>
      </div>
    </div>
  );
}
