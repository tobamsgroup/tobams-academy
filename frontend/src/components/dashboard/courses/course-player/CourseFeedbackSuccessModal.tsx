"use client";

import { ICONS } from "@/assets/icons";

type CourseFeedbackSuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CourseFeedbackSuccessModal({ isOpen, onClose }: CourseFeedbackSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 px-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-success-title"
        className="mx-4 flex w-full max-w-[327px] flex-col items-center rounded-xl bg-white p-6 text-center shadow-xl md:max-w-[564px] md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5">
          <ICONS.ProfileSuccess />
        </div>

        <h2 id="feedback-success-title" className="mb-2 text-[20px] font-semibold text-[#221D23] md:text-xl">
        Thank You for Your Feedback!
        </h2>
        <p className="mb-6 max-w-[287px] leading-relaxed text-[#6C686C] md:max-w-[350px]">
        Your feedback has been successfully submitted.
        Thanks for taking the time to provide feedback.
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
