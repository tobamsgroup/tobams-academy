"use client";

import Image from "next/image";
import { IMAGES } from "@/assets/images";

const STATS = [
  {
    id: 1,
    value: "50+",
    label: "Courses Available",
    description: "Access a wide range of courses across different categories.",
  },
  {
    id: 2,
    value: "100%",
    label: "Satisfaction Rate",
    description: "Positive feedback from our learners who value the quality.",
  },
  {
    id: 3,
    value: "50+",
    label: "Learners / Certifications",
    description: "Learners who have completed courses or earned certifications.",
  },
  {
    id: 4,
    value: "5+",
    label: "Course Categories",
    description: "Explore courses across different fields to build new skills.",
  },
];

export function EmpoweringSection() {
  return (
    <section className="bg-white px-5 pt-[51px] pb-0 md:py-16 md:px-16 lg:py-[96px]">
      {/* Heading */}
      <div className="mb-12 lg:mb-16 text-center">
        <h2 className="mb-3 text-[24px] font-medium md:font-bold text-slate-900 sm:text-[32px] lg:text-[40px]">
          <span className="text-[#B83092]">Empowering</span> Learners <br className="md:hidden block" /> {" "} Worldwide
        </h2>
        <p className="mx-auto lg:text-lg text-base text-[#474348]">
          Delivering high-quality courses that help people gain skills and grow their careers.
        </p>
      </div>

      {/* Content: stats left, image right */}
      <div className="flex flex-col items-start gap-12 lg:flex-row lg:items-center">

        {/* Left — 2x2 stats grid */}
        <div className="grid flex-1 md:grid-cols-2 grid-cols-1 md:gap-x-12 gap-y-6 md:gap-y-12 text-primary">
          {STATS.map((stat) => (
            <div key={stat.id} className="flex flex-col items-center justify-center">
              <span
                className="mb-2 text-[48px] font-semibold md:font-bold lg:text-[64px]"
              >
                {stat.value}
              </span>
              <span className="mb-2 text-lg font-semibold md:font-medium text-[#221D23]">
                {stat.label}
              </span>
              <p className="md:text-lg text-base md:max-w-[264px] text-center leading-relaxed text-[#474348]">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Right — collage image */}
        <div className="w-full hidden md:block flex-shrink-0 lg:w-[48%]">
          <Image
            src={IMAGES.contentBg}
            alt="Learners collage"
            width={560}
            height={490}
            className="h-auto w-full object-contain"
          />
        </div>

          {/* Right — mobile collage image */}  
        <div className="w-full md:hidden flex-shrink-0 lg:w-[48%]">
          <Image
            src={IMAGES.mobileContents}
            alt="Learners collage"
            width={560}
            height={490}
            className="h-auto w-full object-contain"
          />
        </div>
      </div>
    </section>
  );
}