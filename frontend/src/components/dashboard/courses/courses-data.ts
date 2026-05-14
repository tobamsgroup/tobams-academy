import type { StaticImageData } from "next/image";
import { IMAGES } from "@/assets/images";

export type EnrolledCourse = {
  id: string;
  title: string;
  progress: number;
  lastAccessed: string;
  thumbnail: StaticImageData;
};

const thumbs = [
  IMAGES.course1,
  IMAGES.course2,
  IMAGES.course3,
  IMAGES.course4,
] as const;

const titles = [
  "Introduction to Digital Marketing",
  "Web Development for Beginners",
  "Python Programming Essentials",
  "Graphic Design Fundamentals",
  "Artificial Intelligence & ML",
  "Business Analytics & Data Science",
  "Creative Writing & Storytelling",
  "UI/UX Design Principles",
  "DevOps & Cloud Basics",
  "Public Speaking Mastery",
];

export const ENROLLED_COURSES: EnrolledCourse[] = titles.map((title, i) => {
  const id = String(i + 1);
  const progress = i < 6 ? 35 + i * 8 : 100;
  return {
    id,
    title,
    progress,
    lastAccessed: i % 3 === 0 ? "Today" : i % 3 === 1 ? "2 days ago" : "1 week ago",
    thumbnail: thumbs[i % thumbs.length]!,
  };
});

export const COURSES_PAGE_SIZE = 6;

export function getEnrolledCourseById(id: string): EnrolledCourse | undefined {
  return ENROLLED_COURSES.find((c) => c.id === id);
}
