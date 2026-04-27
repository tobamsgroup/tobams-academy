"use client";

import { BookOpen, AlignLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

// ─── Types ───────────────────────────────────────────────────────────────────

interface AssignmentItem {
  id: number;
  title: string;
  score: string | null;
  status: "Submitted" | "Not Submitted";
  feedback: string | null;
}

interface ProgressInsight {
  icon: React.ReactNode;
  label: string;
  highlight: string;
  source: string;
}

interface ModuleItem {
  id: number;
  title: string;
  status: "Completed" | "In Progress" | "Not Started";
}

// ─── Data ────────────────────────────────────────────────────────────────────

const assignments: AssignmentItem[] = [
  {
    id: 1,
    title: "Quiz 1: Cell Structure",
    score: "85%",
    status: "Submitted",
    feedback: "Good understanding",
  },
  {
    id: 2,
    title: "Assignment 1: Lab Report",
    score: null,
    status: "Not Submitted",
    feedback: "No feedback yet",
  },
  {
    id: 3,
    title: "Quiz 2: Genetics",
    score: "85%",
    status: "Submitted",
    feedback: "Good understanding",
  },
];

const insights: ProgressInsight[] = [
  {
    icon: <BookOpen size={20} strokeWidth={1.5} className="text-gray-500" />,
    label: "Learning Pace",
    highlight: "You've been completing 2 modules every week",
    source: "From system analytics",
  },
  {
    icon: <AlignLeft size={20} strokeWidth={1.5} className="text-gray-500" />,
    label: "Strong Subjects",
    highlight: "Strong Areas: Genetics and DNA – 90%+ scores",
    source: "Based on top-performing modules",
  },
];

const modules: ModuleItem[] = [
  { id: 1, title: "Cell Structure",   status: "Completed"   },
  { id: 2, title: "DNA & RNA",        status: "Completed"   },
  { id: 3, title: "Miosis",           status: "In Progress" },
  { id: 4, title: "Genetics Basics",  status: "Not Started" },
  { id: 5, title: "Evolution Theory", status: "Completed"   },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: AssignmentItem["status"] }) {
  const styles =
    status === "Submitted"
      ? "bg-[#EEF0F6] text-primary"
      : "bg-[#D3D2D366] text-[#474348] ";
  return (
    <span className={`font-medium px-2 py-1 rounded-lg ${styles}`}>
      {status}
    </span>
  );
}

function ModuleStatusBadge({ status }: { status: ModuleItem["status"] }) {
  const map: Record<ModuleItem["status"], string> = {
    Completed:    "bg-[#DBEFDC] text-[#4CAF50]",
    "In Progress":"bg-[#FFF7CC] text-[#D5B300]",
    "Not Started":"bg-[#D3D2D366] text-[#474348]",
  };
  return (
    <span className={`text-sm font-medium px-2 py-2 rounded-lg ${map[status]}`}>
      {status}
    </span>
  );
}

function AssignmentCard({ item }: { item: AssignmentItem }) {
  return (
    <div className="rounded-[12px] border border-[#D3D2D366] bg-[#FAFDFF] p-4 space-y-3">
      <h3 className="font-semibold text-heading">{item.title}</h3>
      <div className="flex items-center justify-between text-sm">
        <span className="text-body font-medium text-sm">Score</span>
        <span className="text-body font-medium text-sm">{item.score ?? "–"}</span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">Status</span>
        <StatusBadge status={item.status} />
      </div>
      {item.feedback && (
        <div className="rounded-lg border border-[#EFEFF3] bg-[#FCFCFC] px-2 py-1 text-center text-sm text-[#474348]">
          {item.feedback}
        </div>
      )}
    </div>
  );
}

function InsightCard({ insight }: { insight: ProgressInsight }) {
  return (
    <div className="rounded-[12px] border border-[#D3D2D366] bg-white p-4 space-y-3">
      <div className="w-9 h-9 rounded-lg bg-[#EFEFF3] flex items-center justify-center">
        {insight.icon}
      </div>
      <p className="text-body font-medium text-sm">{insight.label}</p>
      <p className="text-body font-semibold text-sm leading-snug">
        {insight.highlight}
      </p>
      <div className="rounded-lg border border-[#EFEFF3] bg-[#FCFCFC] px-2 py-1 text-center text-sm text-[#474348] italic">
        {insight.source}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CourseDetailPage({ courseTitle }: { courseTitle: string }) {
  return (
    <div className="min-h-screen bg-gray-50  font-sans">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 px-4 py-6 md:px-6 md:py-4  text-gray-400">
        <Link
          href="/dashboard/learning-progress"
          className="hover:text-gray-600 text-[#6C686C] cursor-pointer transition-colors"
        >
          Learning Progress
        </Link>
        <ChevronRight size={14} className="text-heading" />
        <span className="text-primary font-medium">{courseTitle}</span>
      </nav>

      {/* Top grid: Assignments + Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Assignment & Grades */}
        <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#D3D2D366]">
            <h2 className="font-semibold text-heading">
              Assignment &amp; Grades Section
            </h2>
          </div>
          <div className="p-6 space-y-3 max-h-[420px] overflow-y-auto">
            {assignments.map((item) => (
              <AssignmentCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Progress Insight */}
        <div className="bg-white border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#D3D2D366]">
            <h2 className="font-semibold text-heading">Progress Insight</h2>
          </div>
          <div className="py-6 px-4 space-y-3">
            {insights.map((insight, i) => (
              <InsightCard key={i} insight={insight} />
            ))}
          </div>
        </div>
      </div>

      {/* Module Completion Tracker */}
      <div className="bg-white overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="font-semibold text-heading">
            Module Completion Tracker
          </h2>
        </div>

        {/* Mobile: progress summary + cards */}
        <div className="md:hidden px-4 py-5 space-y-4">
          {/* Summary */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#474348]">
              {modules.filter((m) => m.status === "Completed").length} of {modules.length} modules completed
            </p>
            <span className="text-sm font-semibold text-heading">
              {Math.round((modules.filter((m) => m.status === "Completed").length / modules.length) * 100)}% Done
            </span>
          </div>
          {/* Gradient progress bar */}
          <div className="h-2 w-full rounded-full overflow-hidden bg-gray-100">
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.round((modules.filter((m) => m.status === "Completed").length / modules.length) * 100)}%`,
                background: "linear-gradient(to right, #ef4444, #eab308, #22c55e)",
              }}
            />
          </div>

          {/* Module cards */}
          <div className="space-y-3 pt-1">
            {modules.map((mod) => (
              <div
                key={mod.id}
                className="rounded-xl border border-[#D3D2D366] bg-white p-4 space-y-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <div className="w-8 h-8 rounded-lg bg-[#EFEFF3] flex items-center justify-center mb-1">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-[#474348]">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                      </svg>
                    </div>
                    <span className="text-xs text-[#6C686C]">Module {mod.id}</span>
                    <span className="text-sm font-semibold text-heading">{mod.title}</span>
                  </div>
                  <ModuleStatusBadge status={mod.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: table */}
        <div className="hidden md:block overflow-x-auto px-6 py-6">
          <table className="w-full text-left border border-[#D3D2D366] rounded-lg">
            <thead>
              <tr className="border-b border-gray-100 bg-[#FAFDFF]">
                <th className="px-6 py-3 text-sm font-medium text-[#6C686C] uppercase tracking-wider w-16">
                  S/N
                </th>
                <th className="px-4 py-3 text-sm font-medium text-[#6C686C] uppercase tracking-wider">
                  Module
                </th>
                <th className="px-4 py-3 text-sm font-medium text-[#6C686C] uppercase tracking-wider text-right">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {modules.map((mod) => (
                <tr
                  key={mod.id}
                  className="border-b border-gray-50 hover:bg-indigo-50/30 transition-colors duration-150"
                >
                  <td className="px-6 py-4 text-sm text-[#6C686C] font-medium">
                    {mod.id}
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-[#6C686C]">
                    {mod.title}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <ModuleStatusBadge status={mod.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
