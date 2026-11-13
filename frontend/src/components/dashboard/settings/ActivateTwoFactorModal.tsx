"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ICONS } from "@/assets/icons";
import PasswordInput from "@/components/dashboard/settings/PasswordInput";
import type { ActivateTwoFactorModalProps } from "@/types/settings";

export default function ActivateTwoFactorModal({
  isOpen,
  enable,
  loading = false,
  error,
  onClose,
  onConfirm,
}: ActivateTwoFactorModalProps) {
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isOpen) setPassword("");
  }, [isOpen]);

  if (!isOpen) return null;

  const title = enable
    ? "Activate Two-Factor Authentication"
    : "Deactivate Two-Factor Authentication";
  const description = enable
    ? "Please provide your password to verify and activate two-factor authentication"
    : "Please provide your password to verify and deactivate two-factor authentication";
  const actionLabel = enable ? "Activate" : "Deactivate";

  const handleSubmit = () => {
    if (!password.trim() || loading) return;
    void onConfirm(password);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="two-factor-modal-title"
        className="w-full max-w-[327px] rounded-xl bg-white p-6 shadow-xl md:max-w-[480px] md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 id="two-factor-modal-title" className="text-lg font-semibold text-heading md:text-xl">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D3D2D366] text-heading transition-colors hover:bg-gray-200 disabled:opacity-60"
            aria-label="Close"
          >
            <ICONS.ProfileClose />
          </button>
        </div>

        <p className="mb-5 text-sm leading-relaxed text-[#6C686C] md:text-base">{description}</p>

        {error ? (
          <div className="mb-4 rounded-lg bg-secondary/10 p-3 text-sm text-secondary">{error}</div>
        ) : null}

        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="mb-6"
        />

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || !password.trim()}
          className="mb-5 w-full rounded-lg bg-primary py-3 text-sm font-medium text-white transition-colors hover:bg-[#16234a] disabled:opacity-60"
        >
          {loading ? "Please wait..." : actionLabel}
        </button>

        <p className="text-center text-sm text-[#6C686C]">
          Forgot Password?{" "}
          <Link href="/forgot-password" className="font-medium text-primary hover:underline">
            Reset
          </Link>
        </p>
      </div>
    </div>
  );
}
