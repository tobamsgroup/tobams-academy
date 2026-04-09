"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function AboutHero() {
  const router = useRouter();

  return (
    <section className="relative w-full h-[524px] flex items-center justify-center text-center text-white overflow-hidden">
      {/* Background Image */}
      <Image
        src="https://res.cloudinary.com/dpkn1ppzj/image/upload/v1775725291/e01bbf2a0b4b231b3ea0a73b1ea9a9d17e123669_udrmhj.jpg"
        alt="About Us Background"
        fill
        priority
        className="object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Grid Overlay (optional, for your design effect) */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Content */}
      <div className="relative z-10 max-w-3xl px-6">
        {/* Badge */}
        <div className="inline-block mb-6 px-10 py-2 rounded-full bg-[#FFFFFF33] backdrop-blur-md border border-white/20 text-sm tracking-wide">
          ABOUT US
        </div>

        {/* Heading */}
        <h1 className="text-[24px] md:text-[56px] text-white font-bold leading-tight">
          The Central Hub
        </h1>

        <h2 className="text-3xl md:text-[56px] font-semibold text-[#B83092] mt-2">
          For Professional Growth
        </h2>

        {/* Description */}
        <p className="mt-6 text-white text-base md:text-lg leading-relaxed">
          A structured digital environment designed to deliver world-class
          training content. We bridge the gap between ambition and expertise
          through a seamless learning experience.
        </p>

        {/* CTA */}
        <Button
          type="button"
          variant="primary"
          className="mt-8 rounded-lg bg-[#B83092] px-8 py-3.5 text-lg font-medium shadow-lg hover:shadow-[#B83092]/40"
          onClick={() => router.push("/courses")}
        >
          Explore Courses
        </Button>
      </div>
    </section>
  );
}