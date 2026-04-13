 "use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { IMAGES } from "@/assets/images";

export default function AboutSplitSection() {
  const router = useRouter();

  return (
    <section className="w-full bg-[#f5f5f7] lg:py-20 py-6 md:py-12 px-6 md:px-12">
      <div className="max-w-[1312px] mx-auto flex flex-col lg:flex-row md:gap-12 gap-6 items-center">
        
        {/* LEFT: Image Card */}
        <div className="relative">

          {/* Image */}
          <div className="relative rounded-2xl overflow-hidden">
            <Image
              src={IMAGES.aboutSplit}
              alt="Academy"
              width={624}
              height={575}
              className="object-cover w-full h-[353px] md:h-full lg:w-[624px] lg:h-[575px]"
            />

            {/* Optional subtle overlay (matches your style) */}
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
        </div>

        {/* RIGHT: Content */}
        <div className="max-w-xl">
          <h2 className="text-[24px] md:text-3xl lg:text-[40px] font-medium md:font-semibold text-primary">
          About Tobams Group <br /> Academy
          </h2>

          <p className="mt-6 text-[#696969] text-base md:text-lg leading-relaxed max-w-[624px]">
          At Tobams Group Academy (TGA), we are dedicated to providing cutting-edge
           instruction that supports both career and personal growth. With over 200 
           customized courses, we equip you with essential skills and industry-recognised
            certifications. Learn at your own pace, anytime and anywhere, guided by our 
            expert instructors. Our state-of-the-art interactive platform ensures an
             engaging learning experience, complemented by comprehensive career support 
             and continuous content updates to keep you ahead in your field.
             </p>
        <p className="mt-6 text-[#696969] ext-base md:text-lg leading-relaxed block max-w-[624px]">
            Join us at TGA to elevate your learning journey and take the next step towards achieving your goals.
             Our commitment is toempower you with flexible, affordable, and high-quality education that prepares 
             you for success in today's competitive landscape.</p>

          <Button
            type="button"
            variant="primary"
            className="mt-8 rounded-lg bg-gradient-to-r from-[#303869] to-[#303869] px-8 py-3.5 md:text-lg w-full md:w-auto"
            onClick={() => router.push("/courses")}
          >
            Explore Courses
          </Button>
        </div>
      </div>
    </section>
  );
}