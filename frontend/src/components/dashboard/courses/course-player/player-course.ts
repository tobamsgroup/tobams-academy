import type { StaticImageData } from 'next/image'
import type { CourseDetail } from '@/types/course'
import { getCourseThumbnail } from '@/lib/dashboard-courses'

export type PlayerCourse = {
  id: string
  title: string
  slug: string
  thumbnail: string | StaticImageData
  progress: number
}

export function toPlayerCourse(course: CourseDetail, progress = 0): PlayerCourse {
  return {
    id: course.id,
    title: course.title,
    slug: course.slug,
    thumbnail: getCourseThumbnail(course, 0),
    progress,
  }
}
