"use client";

import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#FFFFFF33] px-4 backdrop-blur-[12px]"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative flex w-full max-w-[800px] min-h-[561px] flex-col items-center justify-end rounded-lg bg-white px-10 py-12 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="success-modal-title"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-10 right-10 flex h-12 w-12 items-center justify-center rounded-full border border-[#E5E7EB] text-body transition-colors hover:bg-gray-100"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100 mb-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-600">
            <Check className="h-8 w-8 stroke-[3] text-white" />
          </div>
        </div>

        <div className="flex flex-col gap-3 text-center max-w-[668px] mx-auto mb-10">
          <h2 id="success-modal-title" className="text-[24px] font-medium text-heading mb-4">
            Thank You for Your Interest
          </h2>
          <p className="text-body text-base md:text-lg leading-relaxed max-w-[560px] mx-auto">
            We&apos;ll review your submission and get back to you within 24–72 hours with more
            details and next steps.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          onClick={onClose}
          className="mb-5 w-full rounded-lg bg-primary py-4 text-lg shadow-md hover:bg-[#162060] hover:shadow-[#1E2A6E]/30 hover:translate-y-0 max-w-[650px]"
        >
          Close
        </Button>

        <p className="text-body">
          Have any questions or problems? Kindly{" "}
          <a href="#contact" className="text-primary hover:underline">
            contact us
          </a>
        </p>
      </div>
    </div>
  );
}