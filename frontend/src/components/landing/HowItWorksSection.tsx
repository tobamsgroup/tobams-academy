import { IMAGES } from "@/assets/images"
import Image from "next/image"

const STEPS = [
  {
    title: 'Explore our Courses',
    body: 'Browse through our extensive catalog of courses spanning various domains and industries. Choose the course that aligns with your goals and interests.',
  },
  {
    title: 'Enrol in a Course',
    body: 'Enrol in your chosen course to unlock a world of knowledge. Our enrolment process is user-friendly and seamless, ensuring you can begin learning right away.',
  },
  {
    title: 'Learn at Your Own Pace',
    body: 'Tobams Group Academy offers unmatched flexibility. Learn at your own pace, fitting studies into your schedule. Engage with instructors and peers through forums, Q&A sessions, and community activities. Share insights and gain diverse perspectives.',
  },
  {
    title: 'Earn Certificates',
    body: 'Upon successful completion of a course, earn a certificate that showcases your accomplishment. Use this credential to stand out in your field.',
  },
]

export function HowItWorksSection() {
  return (
    <section className="bg-white px-5 py-16 md:px-12 md:py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-12 text-center text-2xl font-bold text-slate-900 md:text-3xl">
          How It Works
        </h2>
        <div className="flex flex-col gap-8 md:flex-row md:gap-12">
          {/* Left — image placeholder */}
          <div className="flex min-h-[320px] flex-1 items-center justify-center rounded-2xlmd:min-h-[420px]">
            <Image src={IMAGES.howItWorks} alt="howItWorks"/>
          </div>

          {/* Right — steps */}
          <div className="flex flex-1 flex-col justify-center gap-0">
            {STEPS.map((step, i) => (
              <div key={step.title} className="relative flex gap-5 pb-8 last:pb-0">
                {/* Vertical connector */}
                {i < STEPS.length - 1 && (
                  <div className="absolute left-[9px] top-6 h-full w-0.5 bg-[#EF4353]/20" />
                )}
                {/* Dot */}
                <div className="relative z-10 mt-1 h-5 w-5 flex-shrink-0 rounded-full bg-[#EF4353]" />
                <div>
                  <h4 className="mb-1 font-bold text-slate-900">{step.title}</h4>
                  <p className="text-sm leading-relaxed text-slate-500">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
