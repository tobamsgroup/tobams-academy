"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  ChevronDown,
} from "lucide-react";
import { IMAGES } from "@/assets/images";
import { ICONS } from "@/assets/icons";

// ─── Data ────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { label: "Trending",         icon: ICONS.Trending,       id: "trending" },
  { label: "Leadership",       icon: ICONS.Leadership,     id: "leadership" },
  { label: "Business",         icon: ICONS.Bussiness,      id: "business" },
  { label: "NGO",              icon: ICONS.Ngo,            id: "ngo" },
  { label: "Interviewing Skills", icon: ICONS.Interview,   id: "interviewing" },
  { label: "Sustainability",   icon: ICONS.Sustainability, id: "sustainability" },
  { label: "Innovation",       icon: ICONS.Innovation,     id: "innovation" },
  { label: "IT",               icon: ICONS.IT,             id: "it" },
  { label: "More Courses",     icon: ICONS.MrCourses,      id: "more" },
];

const COURSES = [
  {
    id: 1,
    categoryId: "business",
    category: "Business",
    title: "Business Analysis",
    description:
      "Learn innovative problem-solving approaches, foster collaboration, a...",
    price: "£100",
    image: IMAGES.course1,
  },
  {
    id: 2,
    categoryId: "leadership",
    category: "Leadership",
    title: "Leadership Development",
    description:
      "Learn innovative problem-solving approaches, foster collaboration, a...",
    price: "£100",
    image: IMAGES.course2,
  },
  {
    id: 3,
    categoryId: "sustainability",
    category: "Think Sustainability",
    title: "Sustainability for Beginners",
    description:
      "Learn innovative problem-solving approaches, foster collaboration, a...",
    price: "£100",
    image: IMAGES.course3,
  },
  {
    id: 4,
    categoryId: "business",
    category: "Business",
    title: "Business Analysis",
    description:
      "Learn innovative problem-solving approaches, foster collaboration, a...",
    price: "£100",
    image: IMAGES.course4,
  },
  {
    id: 5,
    categoryId: "innovation",
    category: "Innovation",
    title: "Design Thinking",
    description:
      "Learn innovative problem-solving approaches, foster collaboration, a...",
    price: "£120",
    image: null,
  },
  {
    id: 6,
    categoryId: "it",
    category: "IT",
    title: "Cloud Computing Basics",
    description:
      "Learn innovative problem-solving approaches, foster collaboration, a...",
    price: "£150",
    image: null,
  },
];

const CARDS_PER_PAGE = 4;

// ─── Component ───────────────────────────────────────────────────────────────

export function CoursesSection() {
  const [activeCategory, setActiveCategory] = useState("trending");
  const [page, setPage] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  const filteredCourses =
    activeCategory === "trending" || activeCategory === "more"
      ? COURSES
      : COURSES.filter((c) => c.categoryId === activeCategory);

  const totalPages = Math.ceil(filteredCourses.length / CARDS_PER_PAGE);
  const visible = filteredCourses.slice(
    page * CARDS_PER_PAGE,
    page * CARDS_PER_PAGE + CARDS_PER_PAGE,
  );
  const active = CATEGORIES.find((c) => c.id === activeCategory) ?? CATEGORIES[0];

  return (
    <section className="bg-white px-5 py-8 md:py-16 md:px-16">
      {/* Heading */}
      <h2 className="mb-[64px] text-center text-[24px] font-bold leading-tight tracking-[0%] text-slate-900 sm:text-3xl md:text-[40px]">
        Find the Right Course to{" "}
        <span className="text-[#B83092]">Build</span> Your
        <br className="hidden md:block" /> {" "}
        Skills and Advance Your Career
      </h2>

      {/* Category selector */}
      <div className="mb-12">
        {/* Mobile dropdown */}
        <div className="relative mx-auto w-full max-w-[520px] md:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="flex w-full items-center justify-between rounded-xl bg-[#191C32] px-5 py-3.5 text-left text-base font-semibold text-white"
            aria-haspopup="listbox"
            aria-expanded={mobileOpen}
          >
            <span className="flex items-center gap-3">
              {active?.icon ? (
                <active.icon width={18} height={18} stroke="#B83092" />
              ) : null}
              {active?.label}
            </span>
            <ChevronDown className={`h-5 w-5 transition-transform ${mobileOpen ? "rotate-180" : ""}`} />
          </button>

          {mobileOpen ? (
            <div
              className="absolute left-0 right-0 top-[calc(100%+10px)] z-20 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
              role="listbox"
            >
              {CATEGORIES.map(({ label, id }, idx) => (
                <button
                  key={id}
                  type="button"
                  role="option"
                  aria-selected={activeCategory === id}
                  onClick={() => {
                    setActiveCategory(id);
                    setPage(0);
                    setMobileOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-5 py-4 text-left text-base transition-colors ${
                    idx === CATEGORIES.length - 1 ? "text-[#252A64]" : "text-slate-900"
                  } hover:bg-slate-50`}
                >
                  <span>{label}</span>
                  {idx === CATEGORIES.length - 1 ? <ArrowRight className="h-4 w-4" /> : null}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {/* Desktop pills */}
        <div className="mx-auto hidden max-w-[700px] flex-wrap justify-center gap-2 md:flex">
          {CATEGORIES.map(({ label, icon: Icon, id }) => {
            const isActive = activeCategory === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setActiveCategory(id);
                  setPage(0);
                }}
                className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                  isActive ? "bg-[#191C32] text-white" : "bg-[#D3D2D333] text-slate-600 "
                }`}
              >
                <Icon width={15} height={15} stroke={isActive ? "#B83092" : "#221D23"} />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Course Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {visible.map((course) => (
          <Link
            href={`/courses/${course.id}`}
            key={course.id}
            className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            {/* Image area (padded inset) */}
            <div className="w-full bg-white p-3">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-100">
                {course.image ? (
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  // Placeholder when no image is provided
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                    <span className="text-xs text-slate-400">Course Image</span>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col px-4 pb-4 pt-2">
              {/* Category badge */}
              <span className="mb-2 w-fit rounded-sm bg-[#EEF0F6] px-2.5 py-1 text-xs font-medium text-slate-600">
                {course.category}
              </span>

              <h3 className="mb-1.5 text-base font-bold text-slate-900">
                {course.title}
              </h3>

              <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-500">
                {course.description}
              </p>

              <p className="text-base font-bold text-slate-900">{course.price}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination arrows */}
      <div className="mt-10 flex justify-end gap-3">
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-all hover:border-slate-400 disabled:opacity-30"
        >
          <ArrowLeft size={18} />
        </button>
        <button
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={page === totalPages - 1}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-all hover:border-slate-400 disabled:opacity-30"
        >
          <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
}