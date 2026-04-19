"use client";
import Image from "next/image";
import { IMAGES } from "@/assets/images";
import { ICONS } from "@/assets/icons";
import type { FC } from "react";
import type { Iconprops } from "@/types";

const STEPS: {
  id: string;
  title: string;
  description: string;
  Icon: FC<Iconprops>;
}[] = [
  {
    id: "tailored",
    title: "Tailored Solutions",
    description:
      "We provide tailored training to close skill gaps and achieve your business goals.",
    Icon: ICONS.CP1,
  },
  {
    id: "edu-tech",
    title: "Innovative Edu-Tech",
    description:
      "Our platform uses advanced technology to deliver engaging, interactive learning that keeps your team motivated.",
    Icon: ICONS.CP2,
  },
  {
    id: "impact",
    title: "Measurable Impact",
    description:
      "We focus on measurable results, equipping employees with skills that boost performance and drive growth.",
    Icon: ICONS.CP3,
  },
  {
    id: "curriculum",
    title: "All-in-One Curriculum",
    description:
      "We offer a tailored curriculum that equips your team with practical skills to drive business growth.",
    Icon: ICONS.CP4,
  },
];

export function WhyChooseTGA() {
  return (
    <section
      className="relative overflow-hidden px-6 py-8 md:py-[48px] md:px-16 lg:px-8 xl:px-16 bg-primary"
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
      <div className="relative z-10 lg:mb-12 mb-6 text-center">
        <h2 className="mb-4 text-[24px] font-medium md:font-bold text-white sm:text-[32px] lg:text-[40px]">
          Why Companies Choose TGA
        </h2>
        <p className="mx-auto max-w-[540px] md:max-w-[634px] text-base md:text-lg leading-relaxed text-white">
          We&apos;re here to inspire and empower you on your educational journey. Our platform is designed to make learning informative and enjoyable.
        </p>
      </div>

      {/* Steps */}
      <div className="relative z-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step) => {
          const { Icon } = step;
          return (
            <div key={step.id} className="relative flex w-full justify-center">
              <div className="flex w-full md:max-w-[290px] flex-col items-center justify-center rounded-2xl px-2 py-5 md:pb-10 md:pt-4 bg-[#99A1D433] border border-[#E5E7EB]">
                <div className="mb-5 flex items-center justify-center" aria-hidden>
                  <Icon width={64} height={64} />
                </div>

                <h3 className="mb-3 text-lg md:text-xl xl:text-2xl text-center font-bold text-white">{step.title}</h3>
                <p className="text-base md:text-lg lg:text-lg leading-relaxed text-white max-w-[291px] md:max-w-[257px] text-center">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
