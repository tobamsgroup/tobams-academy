"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { IMAGES } from "@/assets/images";

export default function SmarterLearningBanner() {
  const router = useRouter();
  return (
    <section className="bg-[#222643] py-12 px-6 md:px-16 lg:px-24 overflow-hidden">
      <div className="max-w-[1216px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

        {/* Left: Text */}
        <div className="flex flex-col gap-5">
          <h2 className="text-2xl md:text-3xl lg:text-[40px] font-bold text-white leading-snug">
            Smarter Learning at Work
          </h2>
          <p className="text-gray-300 text-lg md:text-[20px] leading-relaxed max-w-[300px] md:max-w-[400px]">
            Join 4,000+ startups already accelerating growth with TGA.
          </p>
          <Button
            type="button"
            className="w-full md:w-fit bg-primary md:bg-white text-white md:text-primary text-lg font-medium px-7 py-3 hover:bg-gray-100 hover:from-gray-100 hover:to-gray-100 hover:translate-y-0"
            onClick={()=>router.push("/corporate-fo")}
          >
            Contact Us
          </Button>
        </div>

        {/* Right: Image with decorative blocks */}
        <div className="relative flex justify-center md:justify-end ">
          {/* Decorative smart grid — top right */}
          <div className="absolute bottom-[-175%] right-0 md:right-[-60%] md:-bottom-[10px] z-10 w-full  overflow-hidden">
            <Image
              src={IMAGES.smartGrid}
              alt=""
              width={502}
              height={492}
              className="object-contain w-[352px] h-full"
              aria-hidden
            />
          </div>


          {/* Main image */}
          <div className="relative w-full max-w-md h-[260px] md:h-[300px] rounded-2xl overflow-hidden z-10">
            <Image
              src={IMAGES.smarterLearning}
              alt="People learning at work"
              fill
              className="object-cover object-center"
              priority
            />
          </div>
        </div>

      </div>
    </section>
  );
}