"use client";

import Image from "next/image";
import Link from "next/link";
import { IMAGES } from "@/assets/images";

export function StartJourneySection() {
  return (
    <section className="bg-[#f5f5f7] px-5 py-16 md:px-16">
      {/* Card with background image */}
      <div className="relative mx-auto max-w-[1216px] overflow-hidden rounded-[20px]">

        {/* Background image */}
        <Image
          src={IMAGES.getInfo}
          alt=""
          fill
          sizes="(min-width: 1024px) 1216px, 100vw"
          priority
          className="object-cover object-[center_22%] sm:object-[center_8%]"
        />

        {/* Primary overlay — theme color with stronger tint */}
        <div className="absolute inset-0 bg-primary/85" aria-hidden />

        {/* Content row */}
        <div className="relative z-10 flex md:min-h-[480px] flex-col items-center gap-6 md:px-8 px-4 py-8 md:py-12 md:flex-row md:justify-between md:px-14">

          {/* Left — headline */}
          <h2 className="text-center md:text-left text-[24px] font-medium md:font-bold leading-tight text-white md:text-[40px]">
            Start Your Learning Journey With Us Today!
          </h2>

          {/* Right — white card */}
          <div className="w-full max-w-md flex-shrink-0 rounded-2xl bg-white py-[27px] md:py-[50px] px-6">
            {/* Top row: label + logo */}
            <div className=" flex items-center justify-between">
              <span
                className="md:text-[15px] text-[14px] md:font-bold uppercase tracking-widest text-[#B83092]"
              >
                For Learners
              </span>
              <Image
                src="https://res.cloudinary.com/dpkn1ppzj/image/upload/v1775584726/newLogo_bp7kfy.png"
                alt="TG Logo"
                width={64}
                height={64}
                className="object-contain md:w-[64px] w-[40px] h-[40px] md:h-[64px]"
              />
            </div>

            <h3 className="mb-3 md:text-[32px] text-[20px] font-semibold text-slate-900">
              Accelerate Your Career
            </h3>

            <p className="mb-6 md:text-[20px] text-[16px] leading-relaxed text-[#474348]">
              Find and apply for a Skills program on TG to start learning
              in-demand skills.
            </p>

            <Link
              href="/courses"
              className="md:text-[20px] text-[16px] underline underline-offset-4 transition-opacity hover:opacity-70"
              style={{ color: "#d6007f" }}
            >
              Explore Courses
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}