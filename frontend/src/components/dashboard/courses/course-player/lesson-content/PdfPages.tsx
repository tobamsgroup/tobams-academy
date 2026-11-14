"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

type Props = {
  /** Raw PDF bytes. A copy is handed to pdf.js because it takes ownership of the buffer. */
  data: ArrayBuffer;
  pageStart: number;
  pageEnd?: number;
  width: number;
  onPageCount?: (total: number) => void;
  /** Called once the last page of the range is mostly on screen (the learner reached the end). */
  onReachedEnd?: () => void;
  /** Height ÷ width of a page, for loading placeholders (A4 portrait ≈ 1.414, 16:9 slide = 0.5625). */
  aspectRatio?: number;
};

/** Renders a page range of a PDF. Loaded with next/dynamic (ssr: false): pdf.js needs the DOM. */
export default function PdfPages({
  data,
  pageStart,
  pageEnd,
  width,
  onPageCount,
  onReachedEnd,
  aspectRatio = 1.414,
}: Props) {
  const file = useMemo(() => ({ data: new Uint8Array(data.slice(0)) }), [data]);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);

  const pages = useMemo(() => {
    if (!numPages) return [];
    const start = Math.min(Math.max(1, pageStart), numPages);
    const end = Math.min(Math.max(start, pageEnd ?? numPages), numPages);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [numPages, pageStart, pageEnd]);

  const lastPageRef = useRef<HTMLDivElement>(null);
  // Latest callback, read by the observer without re-subscribing on every render.
  const reachedEnd = useRef(onReachedEnd);
  useEffect(() => {
    reachedEnd.current = onReachedEnd;
  });
  const lastPage = pages[pages.length - 1];

  useEffect(() => {
    const el = lastPageRef.current;
    if (!el || lastPage === undefined) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) reachedEnd.current?.();
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [lastPage]);

  if (failed) {
    return <p className="p-6 text-sm text-secondary">This reading could not be displayed. Please refresh and try again.</p>;
  }

  return (
    <Document
      file={file}
      onLoadSuccess={({ numPages: total }) => {
        setNumPages(total);
        onPageCount?.(total);
      }}
      onLoadError={() => setFailed(true)}
      loading={<p className="p-6 text-sm text-[#6C686C]">Loading reading…</p>}
    >
      <div className="flex flex-col items-center gap-4">
        {pages.map((n) => (
          <div key={n} ref={n === lastPage ? lastPageRef : undefined} className="shadow-sm ring-1 ring-[#E5E7EB]">
            <Page
              pageNumber={n}
              width={width}
              renderAnnotationLayer={false}
              loading={<div style={{ width, height: width * aspectRatio }} className="animate-pulse bg-[#F3F4F6]" />}
            />
          </div>
        ))}
      </div>
    </Document>
  );
}
