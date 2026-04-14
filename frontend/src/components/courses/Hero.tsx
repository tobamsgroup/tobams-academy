"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { IMAGES } from "@/assets/images";

export default function CoursesHero() {
  const router = useRouter();

  return (
    <section className="relative w-full h-[260px] flex items-center justify-center text-center text-white overflow-hidden">
      {/* Background Image */}
      <Image
        src={IMAGES.aboutHero}
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
        

        {/* Heading */}
        <h1 className="text-[24px] md:text-4xl lg:text-[56px] text-white font-bold leading-tight">
        Course Catalog
        </h1>

      </div>
    </section>
  );
}