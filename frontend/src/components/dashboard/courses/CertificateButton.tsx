"use client";

import { useState } from "react";
import { Award, Loader2 } from "lucide-react";
import type { LearnerCertificate } from "@/hooks/useCertificates";

type Props = {
  certificate: LearnerCertificate;
  onDownload: (cert: LearnerCertificate) => Promise<void>;
  className?: string;
};

/** Downloads the learner's certificate PDF. */
export function CertificateButton({ certificate, onDownload, className }: Props) {
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  const click = async () => {
    setBusy(true);
    setFailed(false);
    try {
      await onDownload(certificate);
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => void click()}
        disabled={busy}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#303869] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#252d56] disabled:opacity-60"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Award className="h-4 w-4" aria-hidden />}
        Download certificate
      </button>
      {failed ? (
        <p className="mt-2 text-center text-xs text-red-600" role="alert">
          Couldn&apos;t download the certificate. Please try again.
        </p>
      ) : null}
    </div>
  );
}
