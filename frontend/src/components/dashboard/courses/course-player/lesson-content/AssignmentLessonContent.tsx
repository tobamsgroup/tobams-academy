"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Loader2,
  UploadCloud,
} from "lucide-react";
import { createAuthedClient } from "@/lib/fetcher";
import type { LessonCompleteResult } from "@/types/enrollment";
import type { LessonContentCommonProps } from "./types";
import { useLessonDocument } from "./useLessonDocument";

const PdfPages = dynamic(() => import("./PdfPages"), {
  ssr: false,
  loading: () => <p className="p-6 text-sm text-[#6C686C]">Loading assignment…</p>,
});

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED = [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".png", ".jpg", ".jpeg"];
const MAX_PAGE_WIDTH = 900;

type Submission = {
  id: string;
  fileName: string;
  mimeType: string;
  size: number;
  submittedAt: string;
  updatedAt: string;
};

type UploadResponse = LessonCompleteResult & { submission: Submission };

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function apiMessage(error: unknown, fallback: string) {
  const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
  return message ?? fallback;
}

/** Saves a blob through a temporary link (the files need the auth header, so no plain <a href>). */
function saveBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * A week's assignment: read or download the brief, then upload the finished work.
 * The lesson is completed by the upload (there is no "Mark as completed" here).
 */
export function AssignmentLessonContent({
  moduleTitle,
  lesson,
  isCompleted,
  prevLesson,
  nextLesson,
  onSelectLesson,
  onCompletedExternally,
}: LessonContentCommonProps) {
  const { data: session } = useSession();
  const token = session?.accessToken;
  const brief = useLessonDocument(lesson);

  const {
    data: submission,
    isLoading: submissionLoading,
    mutate: mutateSubmission,
  } = useSWR(
    token ? ["assignment-submission", lesson.id] : null,
    async () => {
      const res = await createAuthedClient(token).get<{ data: { submission: Submission | null } }>(
        `/lessons/${lesson.id}/submission`,
      );
      return res.data.data.submission;
    },
    { revalidateOnFocus: false },
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setContainerWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploadPct, setUploadPct] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const [downloading, setDownloading] = useState<"brief" | "submission" | null>(null);

  const uploading = uploadPct !== null;
  const submitted = Boolean(submission) || isCompleted;

  const upload = async (file: File) => {
    setUploadError(null);
    setJustSubmitted(false);
    const ext = file.name.includes(".") ? `.${file.name.split(".").pop()?.toLowerCase()}` : "";
    if (!ACCEPTED.includes(ext)) {
      setUploadError(`That file type isn't supported. Upload a PDF, Word, Excel, PowerPoint or image file.`);
      return;
    }
    if (file.size > MAX_BYTES) {
      setUploadError(`That file is ${formatBytes(file.size)}. The maximum is 5 MB.`);
      return;
    }
    if (!token) return;

    const form = new FormData();
    form.append("file", file);
    setUploadPct(0);
    try {
      const res = await createAuthedClient(token).post<{ data: UploadResponse }>(
        `/lessons/${lesson.id}/submission`,
        form,
        {
          onUploadProgress: (e) => {
            if (e.total) setUploadPct(Math.round((e.loaded / e.total) * 100));
          },
        },
      );
      const { submission: saved, ...completion } = res.data.data;
      await mutateSubmission(saved, { revalidate: false });
      setJustSubmitted(true);
      await onCompletedExternally?.(completion);
    } catch (error) {
      setUploadError(apiMessage(error, "Upload failed. Check your connection and try again."));
    } finally {
      setUploadPct(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const download = async (which: "brief" | "submission") => {
    if (!token) return;
    setDownloading(which);
    try {
      const path =
        which === "brief" ? `/lessons/${lesson.id}/document?download=1` : `/lessons/${lesson.id}/submission/file`;
      const res = await createAuthedClient(token).get<Blob>(path, { responseType: "blob" });
      const name = which === "brief" ? `${lesson.title}.pdf` : (submission?.fileName ?? "submission");
      saveBlob(res.data, name);
    } catch {
      setUploadError(which === "brief" ? "Couldn't download the assignment." : "Couldn't download your file.");
    } finally {
      setDownloading(null);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && !uploading) void upload(file);
  };

  const pageWidth = Math.round(Math.min(containerWidth, MAX_PAGE_WIDTH));

  return (
    <div className="pb-10">
      <div className="border-b border-[#D3D2D366] px-6 py-4 md:px-[45px] md:py-[16px]">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#6C686C]">{moduleTitle}</p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h2 className="text-lg font-bold text-[#111827]">{lesson.title}</h2>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
              submitted ? "bg-[#E7F6EC] text-[#0F7B3F]" : "bg-[#FFF4E5] text-[#9A5B00]"
            }`}
          >
            {submitted ? <CheckCircle2 className="h-3.5 w-3.5" aria-hidden /> : null}
            {submitted ? "Submitted" : "Not submitted"}
          </span>
        </div>
      </div>

      <div className="mx-auto mt-6 w-full space-y-6 px-6 md:px-[45px]">
        {/* Step 1: the brief */}
        <section className="rounded-[12px] border border-[#D3D2D366] bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D3D2D366] px-5 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#6C686C]">Step 1</p>
              <h3 className="text-base font-semibold text-[#111827]">Read the assignment</h3>
            </div>
            <button
              type="button"
              onClick={() => void download("brief")}
              disabled={downloading === "brief"}
              className="inline-flex items-center gap-2 rounded-lg border border-[#303869] px-4 py-2 text-sm font-medium text-[#303869] hover:bg-[#EEF0F6] disabled:opacity-60"
            >
              {downloading === "brief" ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <Download className="h-4 w-4" aria-hidden />
              )}
              Download PDF
            </button>
          </div>
          <div ref={containerRef} className="flex justify-center bg-[#F5F5F7] px-2 py-4" onContextMenu={(e) => e.preventDefault()}>
            {brief.error ? (
              <p className="p-6 text-sm text-[#6C686C]">
                {brief.error.message === "not-enrolled"
                  ? "You need active access to this course to view this assignment."
                  : "We couldn't load the assignment. Please refresh and try again."}
              </p>
            ) : brief.data && pageWidth > 0 ? (
              <PdfPages data={brief.data} pageStart={1} width={pageWidth} />
            ) : (
              <p className="p-6 text-sm text-[#6C686C]">Loading assignment…</p>
            )}
          </div>
        </section>

        {/* Step 2: the upload */}
        <section className="rounded-[12px] border border-[#D3D2D366] bg-white px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6C686C]">Step 2</p>
          <h3 className="text-base font-semibold text-[#111827]">Upload your work</h3>
          <p className="mt-1 text-sm text-[#474348]">
            When you&apos;ve finished, upload your completed assignment. This week&apos;s assignment is marked complete
            once it&apos;s uploaded. You can replace it with a newer version at any time.
          </p>

          {submission ? (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#CDEBD8] bg-[#F3FBF6] px-4 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <FileText className="h-5 w-5 shrink-0 text-[#0F7B3F]" aria-hidden />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[#111827]">{submission.fileName}</p>
                  <p className="text-xs text-[#6C686C]">
                    {formatBytes(submission.size)} · submitted {formatWhen(submission.submittedAt)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => void download("submission")}
                disabled={downloading === "submission"}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#303869] hover:underline disabled:opacity-60"
              >
                <Download className="h-4 w-4" aria-hidden /> Download
              </button>
            </div>
          ) : null}

          {justSubmitted ? (
            <p className="mt-3 text-sm font-medium text-[#0F7B3F]" role="status">
              Thanks! Your assignment has been submitted.
            </p>
          ) : null}

          <div
            onDragOver={(e) => {
              e.preventDefault();
              if (!uploading) setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`mt-4 flex flex-col items-center rounded-lg border-2 border-dashed px-6 py-8 text-center transition-colors ${
              dragging ? "border-[#303869] bg-[#EEF0F6]" : "border-[#D3D2D3] bg-[#FAFAFB]"
            }`}
          >
            {uploading ? (
              <>
                <Loader2 className="h-7 w-7 animate-spin text-[#303869]" aria-hidden />
                <p className="mt-3 text-sm font-medium text-[#111827]">Uploading… {uploadPct}%</p>
                <div className="mt-3 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-[#E5E5EA]">
                  <div className="h-full bg-[#303869] transition-all" style={{ width: `${uploadPct}%` }} />
                </div>
              </>
            ) : (
              <>
                <UploadCloud className="h-8 w-8 text-[#303869]" aria-hidden />
                <p className="mt-3 text-sm text-[#111827]">
                  Drag and drop your file here, or{" "}
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    disabled={submissionLoading}
                    className="font-semibold text-[#303869] underline-offset-2 hover:underline"
                  >
                    {submission ? "choose a new file" : "browse"}
                  </button>
                </p>
                <p className="mt-1 text-xs text-[#6C686C]">PDF, Word, Excel, PowerPoint or image · up to 5 MB</p>
              </>
            )}
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPTED.join(",")}
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void upload(file);
              }}
            />
          </div>

          {uploadError ? (
            <p className="mt-3 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700" role="alert">
              {uploadError}
            </p>
          ) : null}
        </section>

        <div className="flex items-center justify-between pt-4">
          {prevLesson ? (
            <button
              type="button"
              onClick={() => onSelectLesson(prevLesson.id)}
              className="inline-flex items-center gap-1 text-sm font-medium text-[#303869] hover:underline"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={2} />
              Previous
            </button>
          ) : (
            <span />
          )}
          {nextLesson ? (
            <button
              type="button"
              onClick={() => onSelectLesson(nextLesson.id)}
              className="inline-flex items-center gap-1 text-sm font-medium text-[#303869] hover:underline"
            >
              Next
              <ChevronRight className="h-4 w-4" strokeWidth={2} />
            </button>
          ) : (
            <span />
          )}
        </div>
      </div>
    </div>
  );
}
