"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import PasswordInput from "@/components/dashboard/settings/PasswordInput";
import type {
  DeactivateAccountModalProps,
  DeactivateAccountPayload,
  DeactivationReasonOption,
} from "@/types/settings";
import { DEACTIVATION_REASON_INACTIVITY } from "@/types/settings";

export default function DeactivateAccountModal({
  isOpen,
  loading = false,
  error,
  onClose,
  onConfirm,
}: DeactivateAccountModalProps) {
  const [reasonType, setReasonType] = useState<DeactivationReasonOption>("inactivity");
  const [otherReason, setOtherReason] = useState("");
  const [password, setPassword] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setReasonType("inactivity");
    setOtherReason("");
    setPassword("");
    setAcknowledged(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const resolvedReason =
    reasonType === "inactivity" ? DEACTIVATION_REASON_INACTIVITY : otherReason.trim();

  const canSubmit =
    acknowledged &&
    password.trim().length > 0 &&
    (reasonType === "inactivity" || otherReason.trim().length > 0);

  const handleSubmit = () => {
    if (!canSubmit || loading) return;
    const payload: DeactivateAccountPayload = {
      password,
      reason: resolvedReason,
    };
    void onConfirm(payload);
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
        aria-labelledby="deactivate-account-title"
        className="mx-4 w-full max-w-[327px] rounded-xl bg-white p-6 shadow-xl md:max-w-[564px] md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex flex-col items-center text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#FEE2E2]">
            <AlertTriangle className="h-7 w-7 text-[#DE2121]" strokeWidth={2} aria-hidden />
          </div>
          <h2 id="deactivate-account-title" className="mb-2 text-lg font-semibold text-heading md:text-xl">
            Are you sure you want to deactivate your profile?
          </h2>
          <p className="text-sm leading-relaxed text-[#6C686C] md:text-base">
            Deactivating your profile will permanently remove all data associated with your account
          </p>
        </div>

        {error ? (
          <div className="mb-4 rounded-lg bg-secondary/10 p-3 text-sm text-secondary">{error}</div>
        ) : null}

        <div className="mb-4">
          <p className="mb-3 text-sm font-semibold text-heading">Reason</p>
          <div className="space-y-3">
            <label className="flex cursor-pointer items-center gap-3 text-sm text-heading">
              <input
                type="radio"
                name="deactivation-reason"
                checked={reasonType === "inactivity"}
                onChange={() => setReasonType("inactivity")}
                className="h-4 w-4 accent-[#1e2d5a]"
              />
              Inactivity for a prolonged period.
            </label>
            <label className="flex cursor-pointer items-center gap-3 text-sm text-heading">
              <input
                type="radio"
                name="deactivation-reason"
                checked={reasonType === "other"}
                onChange={() => setReasonType("other")}
                className="h-4 w-4 accent-[#1e2d5a]"
              />
              Other (Specify below)
            </label>
          </div>
        </div>

        <textarea
          value={otherReason}
          onChange={(e) => setOtherReason(e.target.value)}
          disabled={reasonType !== "other"}
          placeholder="Please specify your reason"
          className="mb-4 min-h-[96px] w-full resize-none rounded-md border border-[#E4E4E4] px-4 py-3 text-sm text-[#262626] outline-none transition-colors placeholder:text-[#A3A3A3] focus:border-[#1e2d5a] disabled:bg-[#F8F8F8] disabled:text-[#A3A3A3]"
        />

        <PasswordInput
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="mb-4"
        />

        <label className="mb-6 flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(e) => setAcknowledged(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#D3D2D3] accent-[#1e2d5a] focus:ring-2 focus:ring-[#1e2d5a]/30 focus:ring-offset-0"
          />
          <span className="text-sm italic text-[#6C686C]">*I acknowledge that this action is irreversible.*</span>
        </label>

        <div className="flex w-full gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-lg bg-[#D3D2D333] py-3 text-sm font-medium text-heading transition-colors hover:bg-gray-200 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit || loading}
            className="flex-1 rounded-lg bg-[#D3D2D333] py-3 text-sm font-medium text-heading transition-colors hover:bg-gray-200 disabled:pointer-events-none disabled:opacity-40"
          >
            {loading ? "Please wait..." : "Deactivate Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}
