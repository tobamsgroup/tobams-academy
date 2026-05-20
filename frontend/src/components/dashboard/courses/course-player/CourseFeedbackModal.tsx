"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export type CourseFeedbackModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called when user submits; close modal after handling. */
  onSubmit?: (rating: number, comment: string) => void;
};

export function CourseFeedbackModal({ open, onOpenChange, onSubmit }: CourseFeedbackModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setRating(3);
      setComment("");
    }
  }, [open]);

  if (!mounted || !open) return null;

  const handleSubmit = () => {
    if (rating < 1) return;
    onSubmit?.(rating, comment);
    onOpenChange(false);
  };

  const node = (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onOpenChange(false);
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-modal-title"
        className="w-full max-w-[607px] rounded-lg bg-white p-8 shadow-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 id="feedback-modal-title" className="text-center text-[24px] font-semibold text-[#221D23]">
          Share Your Feedback
        </h2>
        <p className="mt-3 text-center leading-relaxed text-[#474348]">
          We&apos;d love to hear your thoughts! Your feedback helps us improve the course experience. How would you rate
          this course?
        </p>

        <div className="mt-6 flex justify-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              className="rounded p-0.5 text-amber-400 transition hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#303869]"
              aria-label={`${n} stars`}
            >
              <Star
                className={cn("h-9 w-9", n <= rating ? "fill-[#FFD700]" : "fill-none stroke-[#474348]")}
                strokeWidth={n <= rating ? 0 : 1.5}
              />
            </button>
          ))}
        </div>

        <label className="mt-6 block text-sm font-medium text-[#374151]">
          <span className="sr-only">Feedback</span>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={10}
            placeholder="Write your feedback here..."
            className="mt-1.5 w-full resize-none rounded-md border border-[#D3D2D3] px-3 py-2.5 text-sm text-[#111827] placeholder:text-[#474348] focus:border-[#303869] focus:outline-none focus:ring-1 focus:ring-[#303869]"
          />
        </label>

        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={rating < 1}
            className="w-full rounded-lg bg-[#303869] py-3 text-sm font-semibold text-white transition hover:bg-[#252d56] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Submit Feedback
          </button>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-full rounded-lg bg-[#F3F4F6] py-3 text-sm font-semibold text-[#374151] transition hover:bg-[#E5E7EB]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(node, document.body);
}
