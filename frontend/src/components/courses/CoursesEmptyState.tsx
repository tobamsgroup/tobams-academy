'use client'

import Image from 'next/image'
import { IMAGES } from '@/assets/images'
import { Button } from '@/components/ui/Button'

interface Props {
  search?: string
  onExplore?: () => void
}

export function CoursesEmptyState({ onExplore }: Props) {
  return (
    <div className="flex w-full min-h-[calc(100vh-360px)] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex w-full max-w-[640px] flex-col items-center">
        <Image
          src={IMAGES.comingSoon}
          alt="Course coming soon"
          width={180}
          height={180}
          className="h-[140px] w-[140px] object-contain md:h-[180px] md:w-[180px]"
          priority
        />

        <h2 className="mt-8 text-2xl font-semibold text-heading md:text-[28px]">
          Course Coming Soon
        </h2>

        <p className="mt-3 max-w-[520px] text-sm leading-relaxed text-[#474348] md:text-base">
          This course is currently being set up on Tobams Group Academy. Please check back later or
          explore other available courses while you wait.
        </p>

        <Button
          type="button"
          onClick={onExplore}
          className="mt-8 w-full max-w-[420px] rounded-lg bg-primary px-6 py-3.5 text-base font-medium text-white shadow-none hover:translate-y-0 hover:bg-[#232A59] hover:from-[#232A59] hover:to-[#232A59] hover:shadow-none"
        >
          Explore Available Courses
        </Button>
      </div>
    </div>
  )
}
