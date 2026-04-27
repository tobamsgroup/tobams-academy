"use client";

import { ICONS } from "@/assets/icons";

interface ProfileSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export default function ProfileSuccessModal({
  isOpen,
  onClose,
  title = "Profile Updated Successfully",
  message = "Your profile information has been successfully updated.",
}: ProfileSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-[327px] md:max-w-[564px] mx-4 p-5 md:p-8 flex flex-col items-center text-center">
        {/* Icon */}
        <div className="mb-6">
          <ICONS.ProfileSuccess />
        </div>

        {/* Text */}
        <h2 className="md:text-[20px] font-semibold text-heading mb-2">{title}</h2>
        <p className="text-sm text-body max-w-[287px] md:max-w-none leading-relaxed mb-6">{message}</p>

        {/* Button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-lg bg-[#DBEFDC] text-[#099137] font-medium text-sm hover:bg-green-100 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
