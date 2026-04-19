"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function CorporateTraining() {
  const router = useRouter();

  return (
    <section
      className="relative overflow-hidden px-5 py-16 md:px-16"
      style={{ background: "#101321" }}
    >
      {/* Background perspective grid */}
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="https://res.cloudinary.com/dpkn1ppzj/image/upload/v1775583765/Perspective_Grid_wclxte.png"
          alt=""
          fill
          className="object-cover opacity-60"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex max-w-[1216px] flex-col items-center gap-10 lg:flex-row lg:gap-16">

        {/* Left — image (below text until large screens / desktop) */}
        <div className="order-2 w-full flex-shrink-0 lg:order-1 lg:w-[46%]">
          <Image
            src="https://res.cloudinary.com/dpkn1ppzj/image/upload/v1775583647/5aa00c7d984d75fb9922eb29f1f45f0ac2cfeda7_hwoadn.jpg"
            alt="Corporate Training"
            width={680}
            height={480}
            className="h-auto w-full rounded-2xl object-cover"
          />
        </div>

        {/* Right — text */}
        <div className="order-1 flex flex-1 flex-col lg:order-2">
          <h2 className="mb-5 text-3xl font-semibold text-white sm:text-4xl md:text-[40px]">
            Corporate Training
          </h2>

          <p className="mb-4 text-lg leading-relaxed text-white">
            Empower your organization with customized training programs designed to
            upskill your teams, enhance productivity, and drive sustainable business
            growth.
          </p>

          <p className="mb-8 text-lg leading-relaxed text-white">
            Our corporate training solutions are tailored to meet your
            organization's unique goals, operational needs, and industry
            requirements.
          </p>

          <Button
            type="button"
            variant="primary"
            className="w-full bg-primary py-3.5 px-8 text-sm text-white lg:w-fit lg:bg-white lg:text-lg lg:text-primary"
            onClick={() => router.push("/corporate")}
          >
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
}