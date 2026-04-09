import Image from "next/image";
import { IMAGES } from "@/assets/images";

export default function MissionVisionSection() {
    return (
      <section className="relative overflow-hidden bg-primary py-6 md:py-16 px-6 md:px-16 lg:px-24">
        {/* Grid background */}
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

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mission Card */}
          <div className="bg-white rounded-2xl py-6 px-6 md:py-12 md:px-10 flex flex-col gap-4">
        
            <h3 className="text-[24px] lg:text-[28px] font-bold text-[#221D23]">Our Mission</h3>
  
            <p className="text-[#474348] text-base md:text-lg text-justify">
              Our mission is to make professional learning accessible, structured,
              and easy to navigate. The platform is designed to remove technical
              barriers so learners can focus on acquiring knowledge, developing
              skills, and advancing their careers through high-quality training
              programs.
            </p>
          </div>
  
          {/* Vision Card */}
          <div className="bg-white rounded-2xl py-6 px-6 md:py-12 md:px-10 flex flex-col gap-4">
           
            <h3 className="text-[24px] lg:text-[28px] font-bold text-[#221D23]">Our Vision</h3>
  
            <p className="text-[#474348] text-base md:text-lg text-justify">
              To become a leading global platform where professionals everywhere
              can continuously learn, develop skills, and unlock new career
              opportunities without barriers.
            </p>
          </div>
        </div>
      </section>
    );
  }