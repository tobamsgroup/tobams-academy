"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IMAGES } from "@/assets/images";

export function Hero() {

  return (
    <section className="flex min-h-[520px] flex-col md:flex-row px-16 py-9">
      {/* Left */}
      <div className={`flex flex-1 flex-col justify-center  transition-all duration-700 `}>
        <h1 className="mb-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl md:text-5xl">Embark on a Journey of Lifelong Learning with Us</h1>
        <p className="mb-8 max-w-md text-base leading-relaxed text-slate-500">Experience limitless knowledge with our certified courses, opening up a world of opportunities</p>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/register" className="rounded-xl bg-[#252A64] px-6 py-3.5 text-sm font-bold text-white transition-all hover:-translate-y-1 hover:opacity-90">
            Enroll Now →
          </Link>
          <Link href="/courses" className="rounded-xl border-2 border-slate-200 px-6 py-3.5 text-sm font-semibold text-slate-600 transition-all hover:border-[#571244] hover:text-[#571244]">
           Learn More
          </Link>
        </div>
      </div>

      {/* Right — image placeholder */}
      <div className="relative hidden flex-shrink-0 md:block md:w-1/2">
        <div className="flex h-full min-h-[520px] w-full items-center justify-center ">
          <Image src={IMAGES.Hero} alt="Hero" className="rounded-[12px]"/>
        </div>
      </div>
    </section>
  );
}
