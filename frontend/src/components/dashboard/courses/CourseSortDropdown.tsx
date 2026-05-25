"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { ICONS } from "@/assets/icons";

export type CourseSortKey = "recent" | "active" | "az";

const OPTIONS: { value: CourseSortKey; label: string }[] = [
  { value: "recent", label: "Most Recent" },
  { value: "active", label: "Most Active" },
  { value: "az", label: "Name (A-Z)" },
];

type CourseSortDropdownProps = {
  value: CourseSortKey;
  onChange: (value: CourseSortKey) => void;
  className?: string;
};

export default function CourseSortDropdown({ value, onChange, className }: CourseSortDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const currentLabel = OPTIONS.find((o) => o.value === value)?.label ?? "Most Recent";

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={`relative inline-block max-w-full ${className ?? ""}`}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Sort courses"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex max-w-full min-w-0 items-center justify-start gap-2 rounded-lg border-0 bg-transparent px-4 py-2 text-left text-sm font-medium text-[#221D23] outline-none transition-opacity hover:opacity-80 active:opacity-70 focus-visible:outline-none focus-visible:ring-0 lg:min-w-[200px] lg:justify-between lg:border lg:border-[#D3D2D366] lg:bg-white lg:px-4 lg:py-2.5 lg:hover:bg-gray-50 lg:hover:opacity-100 lg:focus-visible:ring-2 lg:focus-visible:ring-blue-500 lg:focus-visible:ring-offset-0"
      >
        <span className="flex min-w-0 items-center gap-2 lg:flex-1">
          <span className="shrink-0 lg:hidden">
            <ICONS.Sort />
          </span>
          <span className="lg:hidden">Sort</span>
          <span className="hidden min-w-0 truncate lg:inline">{currentLabel}</span>
        </span>
        <ChevronDown
          className={`hidden h-4 w-4 shrink-0 text-gray-600 transition-transform lg:block ${open ? "lg:rotate-180" : ""}`}
          strokeWidth={2}
          aria-hidden
        />
      </button>

      {open ? (
        <ul
          role="listbox"
          className="absolute right-0 z-50 mt-2 w-max min-w-[220px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-[#E5E7EB] bg-[#FAFDFF] py-2 shadow-md ring-1 ring-black/[0.04]"
        >
          {OPTIONS.map((opt) => (
            <li key={opt.value} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={value === opt.value}
                className="w-full px-5 py-4 text-left text-sm font-normal leading-snug text-[#1a1a1a] transition-colors hover:bg-[#E8ECF4]/60"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
