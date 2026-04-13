"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { IMAGES } from "@/assets/images";
import { ICONS } from "@/assets/icons";
import { Button } from "@/components/ui/Button";

const features = [
  {
    id: "self-learning",
    icon: <ICONS.Comment />,
    title: "Online Self Learning",
    description: "Boost employee engagement and professional growth through targeted learning",
    bullets: [
      "Access courses tailored to emerging skills and industry trends",
      "Track progress and achievements in real time",
      "Our platform allows employees to learn at their own pace.",
    ],
    cta: { label: "Enroll Now", href: "/courses" },
    imageAlt: "Team collaborating on laptop",
    imageSrc: IMAGES.faceToFace,
    imageLeft: false,
  },
  {
    id: "face-to-face",
    icon: <ICONS.RoundedCircle />,
    title: "Online Face-to-Face",
    description: "Empower your team with interactive, face-to-face learning that drives engagement, practical skills, and real-time collaboration.",
    bullets: [
      "Join live, face-to-face sessions with experienced instructors.",
      "Engage in interactive activities to deepen your understanding.",
      "Collaborate with peers and build strong professional networks.",
    ],
    cta: { label: "Contact Us", href: "/contact" },
    imageAlt: "Team in face-to-face session",
    imageSrc: IMAGES.selfLearning,
    imageLeft: true,
  },
];

export default function FeaturesSection() {
  const router = useRouter();

  return (
    <section className="bg-[#FFFFFF] lg:py-20 py-6 px-6 md:px-16 lg:px-24">
      <div className="max-w-[1312px] mx-auto flex flex-col gap-8 md:gap-20">

        {/* Header */}
        <div className="text-center flex flex-col">
          <span className="text-accent-pink text-sm md:text-base font-medium uppercase tracking-widest mb-3">
            Features
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-[40px] font-bold text-heading leading-tight mb-5">
            Offer 24/7 Access To Our Extensive <br className="hidden md:block" />
            Course Collection
          </h2>
          <p className="text-body text-base md:text-lg leading-relaxed max-w-[578px] mx-auto">
            Employees around the world can learn in-demand skills when it works
            for them and improve resilience with wellness programs.
          </p>
        </div>

        {/* Feature Rows */}
        {features.map((feature) => (
          <div
            key={feature.id}
            className={`grid grid-cols-1 md:grid-cols-2 gap-24 items-center`}
          >
            {/* Text side */}
            <div
              className={`flex flex-col ${
                feature.imageLeft ? "md:order-2" : "md:order-1"
              }`}
            >
                <div
                  className="w-12 h-12 bg-[#FFFFFF] border border-[#E5E7EB] rounded-[10px] flex items-center justify-center mb-6"
                  style={{ boxShadow: "0px 2px 48.5px -12px #1018281A" }}
                >
                {feature.icon}
                </div>
              

              <h3 className="text-xl lg:text-[32px] font-semibold text-heading mb-4">
                {feature.title}
              </h3>
              <p className="text-heading text-base md:text-lg leading-relaxed mb-8">
                {feature.description}
              </p>

              <div className="relative mb-8 h-[260px] w-full overflow-hidden rounded-2xl md:hidden">
                <Image
                  src={feature.imageSrc}
                  alt={feature.imageAlt}
                  fill
                  className="object-cover"
                />
              </div>

              <ul className="flex flex-col gap-5">
                {feature.bullets.map((bullet, i) => (
                  <li key={i} className="flex items-start gap-3 text-body text-base md:text-lg">
                    <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center [&_svg]:block">
                      <ICONS.SquareCheck />
                    </span>
                    <span className="min-w-0 flex-1 leading-relaxed">{bullet}</span>
                  </li>
                ))}
              </ul>

              <Button
                type="button"
                className="mt-8 w-full bg-primary  px-8 py-3 text-base md:text-lg font-medium text-white hover:bg-[#162060] hover:from-[#162060] hover:to-[#162060] hover:translate-y-0 md:w-fit"
                onClick={() => router.push(feature.cta.href)}
              >
                {feature.cta.label}
              </Button>
            </div>

            {/* Image side */}
            <div
              className={`relative hidden w-full h-[428px] overflow-hidden rounded-2xl md:block ${
                feature.imageLeft ? "md:order-1" : "md:order-2"
              }`}
            >
              <Image
                src={feature.imageSrc}
                alt={feature.imageAlt}
                fill
                className="object-cover"
              />
            </div>
          </div>
        ))}

      </div>
    </section>
  );
}