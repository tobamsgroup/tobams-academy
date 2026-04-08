"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { IMAGES } from "@/assets/images";
import { Button } from "@/components/ui/Button";

export function LevelUpSection() {
  const router = useRouter();

  return (
    <section className="bg-[#FFFAFA] px-5 py-10 md:py-[102px] md:px-16">
      {/* Card */}
      <div
        className="relative mx-auto flex min-h-[400px] max-w-[1216px] flex-col overflow-visible rounded-2xl px-6 py-10 md:flex-row md:px-0 md:py-0 md:pl-10 lg:pl-16 xl:pl-24"
        style={{
          background: "linear-gradient(180deg, #0B102C 85.56%, #DE00A5 108.13%)",
        }}
      >
        {/* Left — image overflowing top and bottom */}
        <div className="relative hidden w-[42%] flex-shrink-0 md:block">
          <div className="absolute -top-4 -bottom-4 left-14 w-[88%] md:left-20 lg:left-24">
            <Image
              src={IMAGES.levelUp}
              alt="Level up your skill"
              fill
              className="-scale-x-100 rounded-2xl object-cover object-top"
            />
            {/* Bottom fade to match gradient */}
          </div>
        </div>

        {/* Right — text content */}
        <div className="flex flex-1 flex-col items-start justify-center md:items-start md:px-8 md:py-12 md:ml-20">
          <h2 className="mb-4 text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-[40px]">
            Level Up Your <br className="hidden md:flex" /> Skill!
          </h2>
          <p className="mb-8 max-w-[437px] text-lg leading-relaxed text-[white]">
            Join other leading professionals on Tobams Group Academy for learning &amp; development.
          </p>
          <Button
            type="button"
            variant="primary"
            className="bg-[#B83092] px-8 py-3.5 text-lg w-full md:w-auto"
            onClick={() => router.push("/courses")}
          >
            Explore Courses
          </Button>

          {/* Mobile image (below text) */}
          <div className="relative mt-10 h-[260px] w-full overflow-hidden rounded-2xl md:hidden">
            <Image
              src={IMAGES.levelUp}
              alt="Level up your skill"
              fill
              className="-scale-x-100 object-cover object-top"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}