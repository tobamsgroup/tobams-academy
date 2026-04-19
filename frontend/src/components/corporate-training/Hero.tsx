"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { IMAGES } from "@/assets/images";
import { useRouter } from "next/navigation";


export default function UpskillHero() {
  const router = useRouter();

  return (
    <section className="bg-[#EEF0F6] py-6 lg:py-12 px-6  lg:px-[54px] overflow-hidden">
      <div className="relative grid grid-cols-1 md:grid-cols-2 md:gap-10 gap-4 items-center md:min-h-[551px]">

        {/* Left: Text content */}
        <div className="flex flex-col  z-10">
          <h1 className="text-3xl md:text-4xl lg:text-[56px] font-semibold text-heading leading-tight mb-6">
            Upskill Employees With <br className="hidden md:block" />
            Expert-Led Courses
          </h1>

          <p className="text-body text-base md:text-lg leading-relaxed max-w-[885px] mb-10">
            With flexible learning, you can attract, develop, and retain top
            talent, empowering your workforce to grow while driving
            organizational success.
          </p>

          <div className="flex items-center gap-6 flex-col md:flex-row">
            <Button
              type="button"
              variant="ghost"
              className="border-[2px] border-primary text-primary text-base md:text-lg bg-white font-medium px-6 py-3 hover:bg-primary hover:text-white w-full md:w-auto"
              onClick={() => router.push("/courses")}
            >
              Explore Courses
            </Button>
            <Button
              type="button"
              className="bg-primary text-white font-medium text-base md:text-lg border-[2px] border-primary px-6 py-3 hover:bg-[#162060] hover:from-[#162060] hover:to-[#162060] hover:translate-y-0 w-full md:w-auto"
              onClick={() => router.push("/contact")}
            >
              Contact Us
            </Button>
          </div>
        </div>

        {/* Right: Image with decorative pattern */}
        <div className="relative flex justify-end items-center">
          {/* Decorative diagonal lines — top right */}
          {/* <div className="hidden md:block absolute top-0 right-0 w-28 h-28 opacity-30 pointer-events-none">
            <Image
              src={IMAGES.linePattern}
              alt=""
              fill
              className="object-contain"
              sizes="112px"
              aria-hidden
            />
          </div> */}

          {/* Image with rounded top corners */}
          <div className="md:absolute xl:right-[-10%] md:right-[-5%] xl:top-[-250px] w-full max-w-[110%] md:max-w-[550px]">
            {/* Replace src with your actual image */}
            <Image
              src={IMAGES.corporateHero}
              alt="Employees learning"
              width={446}
              height={497}
              className="w-[700px] max-w-[110%] md:w-full md:max-w-full h-full object-cover object-top"
              priority
            />
          </div>
        </div>

      </div>
    </section>
  );
}