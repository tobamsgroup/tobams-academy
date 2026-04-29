"use client";

import { useState } from "react";

// ── Icons ─────────────────────────────────────────────────────────────────────

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

const BackArrowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SocialLinkData {
  label: string;
  url: string;
  placeholder: string;
}

interface Props {
  links: SocialLinkData[];
  onClose: () => void;
  onSave: (updated: SocialLinkData[]) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

const inputClass =
  "w-full rounded border border-[#D3D2D3] bg-white px-2 py-2.5 text-heading placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition";

export default function EditSocialLinksModal({ links, onClose, onSave }: Props) {
  const [values, setValues] = useState<SocialLinkData[]>(links.map((l) => ({ ...l })));

  function handleChange(index: number, url: string) {
    setValues((prev) =>
      prev.map((item, i) => (i === index ? { ...item, url } : item))
    );
  }

  function handleSave() {
    onSave(values);
    onClose();
  }

  return (
    <div
      className="fixed inset-x-0 bottom-0 top-14 z-50 bg-[#FAFDFF] md:inset-0 md:flex md:items-center md:justify-center md:bg-black/40 md:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="h-full w-full flex flex-col md:h-auto md:max-w-[607px] md:rounded-lg md:max-h-[90vh] md:bg-[#FAFDFF]">

        {/* Mobile header: back arrow + stacked title */}
        <div className="md:hidden px-6 pt-5 pb-4 shrink-0">
          <button onClick={onClose} className="text-heading" aria-label="Back">
            <BackArrowIcon />
          </button>
          <h2 className="text-[20px] font-semibold text-heading mt-2">Edit Social Links</h2>
        </div>

        {/* Desktop header: title + close button inline */}
        <div className="hidden md:flex items-center justify-between px-6 pt-5 pb-4 shrink-0">
          <h2 className="text-[20px] font-semibold text-heading">Edit Social Links</h2>
          <button
            onClick={onClose}
            className="flex h-12 w-12 font-semibold items-center justify-center rounded-full bg-[#D3D2D366] text-heading hover:bg-gray-200 transition-colors"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Scrollable body + footer together */}
        <div className="overflow-y-auto px-6 py-5 flex flex-col gap-6 flex-1">
          {values.map((link, index) => (
            <div key={link.label} className="flex flex-col gap-1.5">
              <label className="text-heading">{link.label}</label>
              <input
                type="url"
                value={link.url}
                onChange={(e) => handleChange(index, e.target.value)}
                className={inputClass}
                placeholder={link.placeholder}
              />
            </div>
          ))}

          {/* Footer: stacked on mobile (save on top), side-by-side on desktop */}
          <div className="flex flex-col-reverse gap-3 pt-2 pb-4 md:flex-row md:border-t md:border-gray-100 md:pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg bg-[#D3D2D333] py-3 font-medium text-heading hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 rounded-lg bg-primary py-3 font-medium text-white hover:opacity-90 transition-opacity"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
