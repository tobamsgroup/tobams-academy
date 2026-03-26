import { IMAGES } from "@/assets/images"
import Image from "next/image"

const FEATURES = [
  {
    image:IMAGES.tp1,
    title: 'Certified Programs',
    body: 'Our industry-recognised certifications open up a world of opportunities, delivering transformative learning experiences tailored to your aspirations.',
  },
  {
    image:IMAGES.tp2,
    title: 'Flexible Learning Options',
    body: 'Study at your own pace, anytime and anywhere. Our self-paced learning platform allows you to progress through the material at your speed. This flexibility accommodates your individual schedule and commitments, ensuring you can fully engage with the content comfortably.',
  },
  {
    image:IMAGES.tp3,
    title: 'Extensive Course Selection',
    body: 'Access over 200 diverse courses tailored to your needs. Our platform offers prestigious certified courses, catering to various interests and professional requirements. Explore a wide range of courses across different domains and industries, allowing you to choose what best aligns with your goals.',
  },
  {
    image:IMAGES.tp4,
    title: 'Community and Networking',
    body: 'We encourage community engagement, networking opportunities, and collaboration through forums, Q&A sessions, and other interactive features. Join a vibrant community of learners and professionals, and enrich your educational experience through meaningful connections and shared knowledge.',
  },
]

export function WhyLearnSection() {
  return (
    <section className="bg-white px-5 py-16 md:px-12 md:py-20">
      <div className="mx-auto max-w-4xl">
        <p className="mb-2 text-center text-xs font-extrabold uppercase tracking-widest text-[#EF4353]">
          TOP VALUES
        </p>
        <h2 className="mb-12 text-center text-2xl font-bold text-slate-900 md:text-3xl">
          Why Learn With Tobams Group Academy
        </h2>

        <div className="flex flex-col divide-y divide-slate-100">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="flex items-start gap-8 py-8 first:pt-0 last:pb-0">
              {/* Illustration placeholder */}
              <div className="hidden h-44.75 w-44.75 shrink-0 items-center justify-center rounded-xl  sm:flex">
               <Image src={feature.image} alt={feature.title}/>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-bold text-slate-900">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{feature.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
