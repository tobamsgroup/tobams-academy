import { ICONS } from "@/assets/icons";

type Objective = {
    title: string;
    description: string;
    icon: React.ReactNode;
  };
  
  const objectives: Objective[] = [
    {
      icon: <ICONS.Hands />,
      title: "Easy Access",
      description:
        "Users can effortlessly find, enroll in, and access training materials without complex navigation or barriers.",
    },
    {
      icon: <ICONS.MenuStep />,
      title: "Structured Content",
      description:
        "Every course follows a logical hierarchy: Course → Modules → Lessons → Materials, ensuring clarity in learning.",
    },
    {
      icon: <ICONS.MultiF />,
      title: "Multi-Format Support",
      description:
        "We support diverse learning styles with videos, presentation slides, PDFs, and downloadable resources.",
    },
    {
      icon: <ICONS.Hands />,
      title: "Progress Tracking",
      description:
        "Learners always know where they stand with visual indicators for completed lessons and course percentage.",
    },
    {
      icon: <ICONS.MultiF />,
      title: "Smooth UX",
      description:
        "Designed for everyone. Our interface is mobile-responsive, fast-loading, and intuitive for non-technical users.",
    },
    {
      icon: <ICONS.Badge />,
      title: "Recognition",
      description:
        "Achievement matters. We provide completion confirmations and certificates to validate your learning journey.",
    },
  ];
  
  export default function CoreObjectives() {
    return (
      <section className="w-full bg-[#EEF0F6] py-6 md:py-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto text-center">
          {/* Heading */}
          <h2 className="text-[24px] lg:text-[40px] font-medium md:font-bold text-heading">
            Core Objectives
          </h2>
  
          <p className="mt-4 md:text-lg text-heading max-w-[630px] mx-auto">
            Our platform is engineered to achieve six fundamental goals that
            ensure a superior learning experience for every user.
          </p>
  
          {/* Grid */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {objectives.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-[16px] p-4 md:p-6 text-left  transition"
              >
                {/* ICON PLACEHOLDER */}
                <div className="w-12 h-12 rounded-xl bg-[#C8CBE1] flex items-center justify-center mb-4">
                  {item.icon}
                </div>
  
                {/* Title */}
                <h3 className="text-[20px] md:text-[28px] font-medium text-black">
                  {item.title}
                </h3>
  
                {/* Description */}
                <p className="mt-3 text-black md:text-lg">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }