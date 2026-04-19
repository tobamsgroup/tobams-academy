"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { IMAGES } from "@/assets/images";
import { Button } from "@/components/ui/Button";

export function Hero() {
  const router = useRouter();

  return (
    <section
      className="relative min-h-[520px] overflow-hidden px-5 pt-10 md:pt-16 pb-0 md:px-16 bg-[#EEF0F6]"
    >
      {/* Tunnel perspective grid background */}
      <div className="pointer-events-none absolute inset-0">
        <Image
          src={IMAGES.tunnel}
          alt=""
          fill
          className="object-cover object-[center_right]"
          sizes="100vw"
          priority
          aria-hidden
        />
      </div>
      <div className="pointer-events-none absolute left-[200px]">
        <Image
          src={IMAGES.purpleFrame}
          alt=""
          width={748}
          height={515}
          className="w-full h-auto"
          priority
          aria-hidden
        />
      </div>


      {/* Soft purple glow blob — top left */}
      <div
        className="pointer-events-none absolute left-1/4 top-1/3 h-64 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(ellipse, #c4b5fd 0%, transparent 70%)" }}
      />

      {/* Top row: headline left, buttons right */}
      <div>
        {/* Left: headline + subtitle */}
        <div className="z-10">
          <h1 className="mb-4 text-[28px] font-semibold leading-tight text-slate-900 md:text-[32px] lg:text-[56px]">
            Transform Your{" "}
            <span className="text-[#B83092]">Career</span>{" "}
            <br className="md:hidden" />
            With
            <br className="hidden lg:flex" />{" "}
            <span className="text-[#B83092]">Professional</span>{" "}
            <span className="text-slate-900">Courses</span>
          </h1>
        </div>

        {/* Right: buttons */}
        <div className="flex flex-col lg:flex-row md:justify-between items-center gap-3 z-10 md:mt-6 w-full">
        <p className="text-lg font-medium leading-relaxed text-[#221D23] ">
            Make your next career move with online courses from 200+ world-class universities and brands.
          </p>
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-3 z-10 w-full md:w-auto">
            <Button
              type="button"
              variant="primary"
              className="w-full rounded-lg bg-primary py-3.5 text-lg shadow-md hover:shadow-[#252A64]/30 md:w-[180px]"
              onClick={() => router.push("/courses")}
            >
              Explore Courses
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full rounded-lg border border-primary text-lg bg-gradient-to-r from-white to-white py-3.5 font-semibold text-slate-700 shadow-sm hover:border-slate-400 hover:from-slate-50 hover:to-slate-50 md:w-[180px]"
              onClick={() => router.push("/register")}
            >
              Log In
            </Button>
          </div>
        </div>
      </div>

      {/* Hero image — full width, flush to bottom */}
      <div className="relative z-10 mt-10 w-full overflow-hidden pb-[34px] md:pb-[64px]">
        <Image
          src={IMAGES.newHero}
          alt="Students learning together"
          width={1312}
          height={500}
          className="h-[340px] w-full lg:h-[500px] object-cover"
          priority
        />
      </div>
    </section>
  );
}