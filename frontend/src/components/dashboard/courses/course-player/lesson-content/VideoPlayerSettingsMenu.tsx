"use client";

import { useEffect, useRef, useState } from "react";
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const QUALITIES = ["1080p", "720p", "480p", "360p", "240p", "144p"] as const;

export function VideoPlayerSettingsMenu() {
  const [open, setOpen] = useState(false);
  const [quality, setQuality] = useState<(typeof QUALITIES)[number]>("720p");
  const [autoplay, setAutoplay] = useState(false);
  const [captions, setCaptions] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn("rounded p-1 hover:bg-black/5", open && "bg-black/10")}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Settings"
      >
        <Settings className="h-5 w-5" strokeWidth={2} />
      </button>

      {open ? (
        <div
          className="absolute bottom-full right-0 z-40 mb-1 max-w-[656px] rounded-lg border border-[#E5E7EB] bg-white py-2 text-sm text-[#111827] shadow-lg"
          role="menu"
        >
          <ul className="max-h-[220px] overflow-y-auto border-b border-[#F0F0F0] py-1">
            {QUALITIES.map((q) => (
              <li key={q}>
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={quality === q}
                  onClick={() => {
                    setQuality(q);
                  }}
                  className={cn(
                    "flex w-full px-3 py-2 text-left hover:bg-[#F8F9FB]",
                    quality === q && "bg-[#EEF2FF] font-medium text-[#303869]",
                  )}
                >
                  {q}
                </button>
              </li>
            ))}
          </ul>
          <div className="space-y-1 px-3 py-2">
            <div className="flex items-center justify-between gap-3 py-1.5">
              <span className="text-[#374151]">Autoplay</span>
              <button
                type="button"
                role="switch"
                aria-checked={autoplay}
                onClick={() => setAutoplay((v) => !v)}
                className={cn(
                  "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                  autoplay ? "bg-emerald-500" : "bg-[#D1D5DB]",
                )}
              >
                <span
                  className={cn(
                    "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200",
                    autoplay ? "translate-x-5" : "translate-x-0",
                  )}
                />
              </button>
            </div>
            <div className="flex items-center justify-between gap-3 py-1.5">
              <span className="text-[#374151]">Turn on captions</span>
              <button
                type="button"
                role="switch"
                aria-checked={captions}
                onClick={() => setCaptions((v) => !v)}
                className={cn(
                  "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                  captions ? "bg-emerald-500" : "bg-[#D1D5DB]",
                )}
              >
                <span
                  className={cn(
                    "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200",
                    captions ? "translate-x-5" : "translate-x-0",
                  )}
                />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
