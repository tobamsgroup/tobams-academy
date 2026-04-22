"use client";

import { useRouter } from "next/navigation";

export default function CookiePolicyHero() {
  const router = useRouter();

  return (
    <section className="relative w-full md:h-[414px] py-[42px] flex items-center justify-center text-center text-white overflow-hidden bg-[#101321]">
  
      {/* Content */}
      <div className="relative z-10 max-w-4xl px-6">
        {/* Badge */}
        <div className="inline-block mb-6 px-2.5 py-2 rounded-full bg-[#FFFFFF33] backdrop-blur-md border border-white/20 text-sm tracking-wide">
        Current as of 17th March 2026
        </div>

        {/* Heading */}
        <h1 className="text-[24px] md:text-4xl lg:text-[56px] text-white font-bold leading-tight">
        Cookie Policy
        </h1>

        {/* Description */}
        <p className="mt-6 text-[#D3D2D3] text-base md:text-lg leading-relaxed">
        We use some cookies to help improve your experience on this website. Here's some more info.
        </p>

      </div>
    </section>
  );
}