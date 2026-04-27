"use client";

import { ICONS } from "@/assets/icons";

interface ProfileErrorModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onTryAgain: () => void;
  title?: string;
  message?: string;
}

export default function ProfileErrorModal({
  isOpen,
  onCancel,
  onTryAgain,
  title = "Profile Update Failed",
  message = "An error occurred while saving your changes. Please check your network connection and try again.",
}: ProfileErrorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-[327px] md:max-w-[564px] mx-4 p-5 md:p-8 flex flex-col items-center text-center">
        {/* Icon */}
        <div className="mb-6">
          <ICONS.ProfileFailed />
        </div>

        {/* Text */}
        <h2 className="md:text-[20px] font-semibold text-heading mb-2">{title}</h2>
        <p className="text-sm text-body max-w-[287px] md:max-w-none leading-relaxed mb-6">{message}</p>

        {/* Buttons */}
        <div className="flex gap-3 w-full md:flex-row flex-col-reverse">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-lg bg-gray-100 text-gray-700 font-medium text-sm hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onTryAgain}
            className="flex-1 py-3 rounded-lg bg-red-600 text-white font-medium text-sm hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
