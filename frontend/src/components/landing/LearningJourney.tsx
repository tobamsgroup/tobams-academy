"use client";
import Image from "next/image";
import { IMAGES } from "@/assets/images";

const STEPS = [
  {
    number: 1,
    title: "Register & Discover",
    description:
      "Create your profile and browse our extensive catalogue of professional courses.",
  },
  {
    number: 2,
    title: "Enroll & Access",
    description:
      "Select your course and instantly access modules, videos, and reading materials.",
  },
  {
    number: 3,
    title: "Learn & Track",
    description:
      "Watch lectures, complete assignments, and track your progress in real-time.",
  },
  {
    number: 4,
    title: "Complete & Certify",
    description:
      "Finish all lessons to receive your official certificate of completion.",
  },
];

export function LearningJourney() {
  return (
    <section
      className="relative overflow-hidden px-6 py-8 md:py-[48px] md:px-16 bg-primary"
    >
      {/* Grid background image */}
      <div className="pointer-events-none absolute inset-0 opacity-25">
        <Image
          src={IMAGES.gridBg}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          aria-hidden
        />
      </div>

      {/* Heading */}
      <div className="relative z-10 mb-12 text-center">
        <h2 className="mb-4 text-[24px] font-medium md:font-bold text-white sm:text-[40px]">
          Your Learning Journey
        </h2>
        <p className="mx-auto max-w-[320px] md:max-w-[634px] text-lg leading-relaxed text-white">
          From registration to certification, we&apos;ve designed a seamless path for your
          professional development.
        </p>
      </div>

      {/* Steps */}
      <div className="relative z-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, index) => (
          <div key={step.number} className="relative flex w-full justify-center">
            {/* Connector line between cards */}
            {index < STEPS.length - 1 && (
              <div
                className="absolute  top-[102px] z-20 hidden h-px w-10 lg:block"
                style={{ background: "#E5E7EB", right: "-32px" }}
              />
            )}

            {/* Card */}
            <div
              className="flex w-full md:max-w-[290px] flex-col items-center justify-center rounded-2xl px-2 py-5 bg-[#99A1D433] border border-[#E5E7EB]"
            >
              {/* Number bubble */}
              <div
                className="mb-5 flex md:h-16 h-12 w-12 md:w-16 items-center justify-center rounded-full md:text-[32px] text-[24px] font-bold text-white bg-primary"
              >
                {step.number}
              </div>

              <h3 className="mb-3 text-lg md:text-2xl font-bold text-white">{step.title}</h3>
              <p className="text-base md:text-lg leading-relaxed text-white max-w-[291px] md:max-w-[257px] text-center">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}