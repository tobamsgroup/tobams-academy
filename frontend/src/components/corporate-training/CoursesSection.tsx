"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IMAGES } from "@/assets/images";
import { ICONS } from "@/assets/icons";
import { Button } from "../ui/Button";

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
    id: 4,
    categoryId: "business",
    category: "Business",
    title: "Business Analysis",
    description:
      "Learn innovative problem-solving approaches, foster collaboration, a...",
    price: "£100",
    image: IMAGES.course4,
  },
];

const CARDS_PER_PAGE_DESKTOP = 4;

// ─── Component ───────────────────────────────────────────────────────────────

export function CoursesSection() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("trending");
  const [page, setPage] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(1);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setCardsPerPage(mq.matches ? CARDS_PER_PAGE_DESKTOP : 1);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const filteredCourses =
    activeCategory === "trending" || activeCategory === "more"
      ? COURSES
      : COURSES.filter((c) => c.categoryId === activeCategory);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCourses.length / cardsPerPage),
  );

  useEffect(() => {
    setPage((p) => Math.min(p, totalPages - 1));
  }, [totalPages]);

  const visible = filteredCourses.slice(
    page * cardsPerPage,
    page * cardsPerPage + cardsPerPage,
  );

  return (
    <section className="bg-white px-5 py-8 md:py-16 md:px-16">
      {/* Heading */}
      <div className="lg:mb-[64px] mb-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
      <h2 className="text-[24px] font-bold leading-tight tracking-[0%] text-slate-900 sm:text-3xl lg:text-[40px]">
      Transform Learning at Work
      </h2>
      <p className="md:text-lg leading-relaxed text-[#474348] mt-5">Equip your team with skills that drive growth and innovation.</p>
      </div>
      <div className="hidden w-full md:block md:w-auto">
        <Button
          variant="primary"
          onClick={() => router.push("/courses")}
          className="w-full bg-primary text-white text-lg md:w-auto"
        >
          Explore Courses
          <ICONS.WhiteArrow className="ml-2" />
        </Button>
      </div>
      </div>

      {/* Course Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D3D2D3] bg-white text-slate-600 transition-all hover:border-slate-400"
        >
          <ICONS.LeftArrow />
        </button>
        <button
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={page === totalPages - 1}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D3D2D3] bg-white text-slate-600 transition-all hover:border-slate-400"
        >
          <ICONS.RightArrow />
        </button>
      </div>

      <div className="mt-8 w-full md:hidden">
        <Button
          variant="primary"
          onClick={() => router.push("/courses")}
          className="w-full bg-primary text-white text-lg"
        >
          Explore Courses
          <ICONS.WhiteArrow className="ml-2" />
        </Button>
      </div>
    </section>
  );
}