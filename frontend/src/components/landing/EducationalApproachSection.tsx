import { IMAGES } from '@/assets/images'
import Image from 'next/image'
import Link from 'next/link'

const PARTNERS = [IMAGES.tobamsgroup, IMAGES.tobamslogic, IMAGES.jitenewton]

export function EducationalApproachSection() {
  return (
    <section className="bg-white">
      {/* Two-column panel */}
      <div className="flex flex-col md:flex-row bg-[#252A64] px-5 py-9 md:px-16">
        {/* Left — dark navy */}
        <div className="flex flex-1 flex-col justify-center px-4 py-12 md:px-12 md:py-16">
          <h2 className="mb-6 text-2xl font-bold text-white md:text-3xl">
            Our Educational Approach
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-white/80">
            Our Educational Approach is centered on the highest standards of excellence and
            innovation, aligned with the prestigious TGA Certification. We integrate
            industry-specific knowledge with practical application, offering a dynamic learning
            experience tailored to match TGA-certified standards.
          </p>
          <p className="mb-8 text-sm leading-relaxed text-white/80">
            Our commitment to our certified courses ensures that learners acquire specialised skills,
            setting them on a path toward professional success and industry recognition.
          </p>
          <div>
            <Link
              href="#"
              className="inline-block rounded-xl border-2 border-white px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#1a1a5e]"
            >
              Learn About Us
            </Link>
          </div>
        </div>

        {/* Right — image */}
        <div className="flex flex-1 items-center justify-center overflow-hidden">
          <Image src={IMAGES.approach} alt='approach' className='h-[490px] w-full object-cover object-top'/>
        </div>
      </div>

      {/* Trusted partners */}
      <div className="flex flex-col items-center gap-6 border-t border-slate-100 px-5 py-10 sm:flex-row sm:justify-between md:px-12">
        <p className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
          OUR TRUSTED PARTNERS
        </p>
        <div className="flex  items-center justify-center gap-10">
          {PARTNERS.map((name, i) => (
           <Image src={name} key={i} alt={i +'trustced'} className=' w-28 object-contain'/>
          ))}
        </div>
      </div>
    </section>
  )
}
