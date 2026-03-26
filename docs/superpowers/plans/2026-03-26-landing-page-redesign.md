# Landing Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Tobams Academy landing page with 14 sections matching the reference design in `frontend/public/Home (1).png`.

**Architecture:** Each section is a standalone React component in `src/components/landing/`. `page.tsx` composes them in order at the end. New sections are pure Server Components (no state/effects needed); Hero keeps its mount animation as a Client Component.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS v4 (CSS-first `@theme`), TypeScript, Lucide React

---

## File Map

| Action | File |
|--------|------|
| Rewrite | `frontend/src/components/landing/Hero.tsx` |
| Create  | `frontend/src/components/landing/PopularCourses.tsx` |
| Delete  | `frontend/src/components/landing/CoursesSection.tsx` (after PopularCourses is wired in page.tsx) |
| Create  | `frontend/src/components/landing/WhyLearnSection.tsx` |
| Create  | `frontend/src/components/landing/CertificationPathsSection.tsx` |
| Create  | `frontend/src/components/landing/InternshipSection.tsx` |
| Create  | `frontend/src/components/landing/EducationalApproachSection.tsx` |
| Create  | `frontend/src/components/landing/TrainingStylesSection.tsx` |
| Create  | `frontend/src/components/landing/HowItWorksSection.tsx` |
| Create  | `frontend/src/components/landing/TestimonialsSection.tsx` |
| Create  | `frontend/src/components/landing/UpcomingEventsSection.tsx` |
| Create  | `frontend/src/components/landing/CTABannerSection.tsx` |
| Rewrite | `frontend/src/components/landing/Footer.tsx` |
| Rewrite | `frontend/src/app/(public)/page.tsx` |

Working directory for all commands: `frontend/`

---

## Task 1: Rewrite Hero.tsx

Replace the right-side animated gradient panel with an image placeholder. Keep left panel copy and CTAs.

**Files:**
- Modify: `src/components/landing/Hero.tsx`

- [ ] **Step 1: Replace Hero.tsx**

```tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export function Hero() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <section className="flex min-h-[520px] flex-col md:flex-row">
      {/* Left */}
      <div
        className={`flex flex-1 flex-col justify-center px-5 py-12 transition-all duration-700 md:px-12 md:py-16 ${
          mounted ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
        }`}
      >
        <p className="mb-3 text-xs font-extrabold uppercase tracking-[2px] text-[#EF4353]">
          ✦ Professional Training Platform
        </p>
        <h1 className="mb-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl md:text-5xl">
          Grow Faster.<br />
          Learn <span className="text-[#EF4353]">Smarter.</span>
        </h1>
        <p className="mb-8 max-w-md text-base leading-relaxed text-slate-500">
          Gain industry-recognised skills with expert-led courses, flexible learning, and TGA-certified programmes.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/register"
            className="rounded-xl bg-[#571244] px-6 py-3.5 text-sm font-bold text-white transition-all hover:-translate-y-1 hover:opacity-90"
          >
            Start Free Trial →
          </Link>
          <Link
            href="/courses"
            className="rounded-xl border-2 border-slate-200 px-6 py-3.5 text-sm font-semibold text-slate-600 transition-all hover:border-[#571244] hover:text-[#571244]"
          >
            Browse Courses
          </Link>
        </div>
        <div className="mt-8 flex items-center gap-3">
          <div className="flex">
            {['👩', '👨', '👩🏿', '👨🏽'].map((emoji, i) => (
              <span
                key={i}
                className={`flex h-8 w-8 ${i > 0 ? '-ml-2' : ''} items-center justify-center rounded-full border-2 border-white bg-[#571244] text-sm shadow-sm`}
              >
                {emoji}
              </span>
            ))}
          </div>
          <p className="text-sm text-slate-500">
            <strong className="text-slate-700">5,000+</strong> learners already enrolled
          </p>
        </div>
      </div>

      {/* Right — image placeholder */}
      <div className="relative hidden flex-shrink-0 md:block md:w-1/2">
        <div className="flex h-full min-h-[520px] w-full items-center justify-center bg-slate-200">
          <span className="text-sm text-slate-400">[Image Placeholder]</span>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: No errors (or only pre-existing errors unrelated to Hero.tsx).

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/Hero.tsx
git commit -m "feat: rewrite Hero with image placeholder right panel"
```

---

## Task 2: Create PopularCourses.tsx

New async Server Component replacing CoursesSection. Adds category pills, redesigned cards with provider/stars/price/Add to Cart, pagination arrows, and Explore All Courses CTA.

**Files:**
- Create: `src/components/landing/PopularCourses.tsx`

- [ ] **Step 1: Create PopularCourses.tsx**

```tsx
import Link from 'next/link'
import type { Course } from '@/types/course'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1'

const CATEGORY_PILLS = [
  'IT Service',
  'Entrepreneurship',
  'Sustainability',
  'Career',
  'Leadership',
]

async function fetchFeaturedCourses(): Promise<Course[]> {
  try {
    const res = await fetch(`${API}/courses/featured`, { next: { revalidate: 300 } })
    if (!res.ok) return []
    const json = (await res.json()) as { data?: Course[] }
    return json.data ?? []
  } catch {
    return []
  }
}

function FeaturedCourseCard({ course }: { course: Course }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      <div className="relative h-48 bg-slate-200">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-xs text-slate-400">[Image Placeholder]</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="mb-1 text-xs font-semibold text-[#571244]">Tobams Group Academy</p>
        <div className="mb-2 flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <span key={i} className="text-xs text-yellow-400">★</span>
          ))}
        </div>
        <h3 className="mb-1 line-clamp-2 text-sm font-bold text-slate-900">{course.title}</h3>
        <p className="mb-3 line-clamp-2 text-xs text-slate-500">{course.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-slate-900">
            {course.price ? `£${course.price}` : 'Free'}
          </span>
          <button
            type="button"
            className="rounded-lg bg-[#1a1a5e] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#571244]"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export async function PopularCourses() {
  const courses = await fetchFeaturedCourses()

  return (
    <section className="bg-slate-50 px-5 py-12 md:px-12 md:py-16">
      {/* Category pills */}
      <div className="mb-8 flex flex-wrap items-center gap-3">
        {CATEGORY_PILLS.map((pill) => (
          <button
            key={pill}
            type="button"
            className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm text-slate-600 transition-colors hover:border-[#571244] hover:text-[#571244]"
          >
            {pill}
          </button>
        ))}
        <Link
          href="/courses"
          className="text-sm font-semibold text-[#EF4353] hover:underline"
        >
          Explore all categories →
        </Link>
      </div>

      {/* Heading */}
      <div className="mb-6">
        <p className="mb-1 text-xs font-extrabold uppercase tracking-widest text-[#EF4353]">
          FEATURED
        </p>
        <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Popular Courses</h2>
      </div>

      {/* Course grid */}
      {courses.length === 0 ? (
        <p className="text-sm text-slate-400">Courses coming soon.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <FeaturedCourseCard key={course.id} course={course} />
          ))}
        </div>
      )}

      {/* Pagination arrows */}
      <div className="mt-6 flex justify-end gap-2">
        <button
          type="button"
          aria-label="Previous"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-lg text-slate-600 transition-colors hover:border-[#571244] hover:text-[#571244]"
        >
          ‹
        </button>
        <button
          type="button"
          aria-label="Next"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-lg text-slate-600 transition-colors hover:border-[#571244] hover:text-[#571244]"
        >
          ›
        </button>
      </div>

      {/* Explore CTA */}
      <div className="mt-8 flex justify-center">
        <Link
          href="/courses"
          className="rounded-xl bg-[#1a1a5e] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#571244]"
        >
          Explore All Courses →
        </Link>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: No new errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/PopularCourses.tsx
git commit -m "feat: add PopularCourses section with category pills and redesigned cards"
```

---

## Task 3: Create WhyLearnSection.tsx

Four stacked feature rows with illustration placeholder, title, and paragraph, separated by dividers.

**Files:**
- Create: `src/components/landing/WhyLearnSection.tsx`

- [ ] **Step 1: Create WhyLearnSection.tsx**

```tsx
const FEATURES = [
  {
    title: 'Certified Programs',
    body: 'Our industry-recognised certifications open up a world of opportunities, delivering transformative learning experiences tailored to your aspirations.',
  },
  {
    title: 'Flexible Learning Options',
    body: 'Study at your own pace, anytime and anywhere. Our self-paced learning platform allows you to progress through the material at your speed. This flexibility accommodates your individual schedule and commitments, ensuring you can fully engage with the content comfortably.',
  },
  {
    title: 'Extensive Course Selection',
    body: 'Access over 200 diverse courses tailored to your needs. Our platform offers prestigious certified courses, catering to various interests and professional requirements. Explore a wide range of courses across different domains and industries, allowing you to choose what best aligns with your goals.',
  },
  {
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
              <div className="hidden h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 sm:flex">
                <span className="text-xs text-slate-400">img</span>
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/landing/WhyLearnSection.tsx
git commit -m "feat: add WhyLearnSection with 4 feature rows"
```

---

## Task 4: Create CertificationPathsSection.tsx

Full-width deep purple background section with a white inset card listing enrollment benefits.

**Files:**
- Create: `src/components/landing/CertificationPathsSection.tsx`

- [ ] **Step 1: Create CertificationPathsSection.tsx**

```tsx
import Link from 'next/link'

const BENEFITS = [
  {
    title: 'Comprehensive Training',
    body: 'Access engaging and thorough training materials, some aligned with TGA certification requirements and others focused on our exclusive curriculum.',
  },
  {
    title: 'Expert Guidance',
    body: 'Learn from industry experts and certified trainers committed to your success.',
  },
  {
    title: 'Interactive Learning',
    body: 'Participate in interactive learning experiences, group discussions, and practical exercises to reinforce your understanding.',
  },
  {
    title: 'Exam Preparation',
    body: 'For those seeking certification, receive targeted exam preparation to boost your confidence and readiness.',
  },
]

export function CertificationPathsSection() {
  return (
    <section className="bg-[#571244] px-5 py-16 md:px-12 md:py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">
          Flexible Paths to Certification with Tobams Group Academy
        </h2>
        <p className="mb-8 text-sm leading-relaxed text-white/80">
          At Tobams Group Academy, we offer a range of flexible options to cater to your learning
          preferences. Whether you choose to enrol in one of our comprehensive courses or aim for
          certification, we provide the right approach for you.
        </p>

        {/* White inset card */}
        <div className="rounded-2xl bg-white p-8">
          <h3 className="mb-2 text-xl font-bold text-[#EF4353]">Enrol in Our Programs</h3>
          <p className="mb-6 text-sm text-slate-500">
            Our expertly crafted courses are designed to cover a variety of key areas, some of which
            are TGA-certified. Gain the following benefits:
          </p>
          <ul className="mb-8 flex flex-col gap-4">
            {BENEFITS.map((b) => (
              <li key={b.title} className="text-sm text-slate-700">
                <strong className="text-slate-900">{b.title}:</strong> {b.body}
              </li>
            ))}
          </ul>
          <Link
            href="/courses"
            className="inline-block rounded-xl bg-[#1a1a5e] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#571244]"
          >
            Explore All Courses →
          </Link>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/landing/CertificationPathsSection.tsx
git commit -m "feat: add CertificationPathsSection with enrollment benefits card"
```

---

## Task 5: Create InternshipSection.tsx

White section with heading, subtext, "Key Benefits" label, and a 2×2 grid of benefit cards, plus a CTA button.

**Files:**
- Create: `src/components/landing/InternshipSection.tsx`

- [ ] **Step 1: Create InternshipSection.tsx**

```tsx
import Link from 'next/link'

const BENEFITS = [
  {
    title: 'Skill Enhancement',
    body: 'Hands-on projects provide practical application, refining your business analysis skills for real-world success.',
  },
  {
    title: 'Global Team Collaboration',
    body: 'Work alongside professionals from around the world, experiencing the dynamics of a global team and enhancing your cross-cultural communication abilities.',
  },
  {
    title: 'Networking Opportunities',
    body: 'Build connections within your industry, expanding your professional network for future career opportunities.',
  },
  {
    title: 'Additional Training',
    body: "Access specialised workshops in agile methodologies and leadership, ensuring you're equipped with the skills needed for success in the dynamic field of business analysis.",
  },
]

export function InternshipSection() {
  return (
    <section className="bg-white px-5 py-16 md:px-12 md:py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-4 text-2xl font-bold text-slate-900 md:text-3xl">
          Internship Opportunities at TGA: Empowering Future Professionals
        </h2>
        <p className="mb-6 text-sm leading-relaxed text-slate-500">
          The TGA certified courses offers exclusive internship opportunities that provide hands-on
          experience, global exposure, and additional training to shape you into a well-rounded
          professional.
        </p>
        <p className="mb-4 text-xs font-extrabold uppercase tracking-widest text-[#EF4353]">
          Key Benefits
        </p>

        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {BENEFITS.map((b) => (
            <div key={b.title} className="rounded-xl bg-slate-50 p-6">
              <h4 className="mb-2 font-bold text-slate-900">{b.title}</h4>
              <p className="text-sm leading-relaxed text-slate-500">{b.body}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Link
            href="/courses"
            className="rounded-xl bg-[#1a1a5e] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#571244]"
          >
            Explore Courses
          </Link>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/landing/InternshipSection.tsx
git commit -m "feat: add InternshipSection with 2x2 benefits grid"
```

---

## Task 6: Create EducationalApproachSection.tsx

Two-column section: dark navy text panel left, image placeholder right. Trusted partners row below.

**Files:**
- Create: `src/components/landing/EducationalApproachSection.tsx`

- [ ] **Step 1: Create EducationalApproachSection.tsx**

```tsx
const PARTNERS = ['Tobams Group', 'Tobams Logic', 'Life Newton']

export function EducationalApproachSection() {
  return (
    <section className="bg-white">
      {/* Two-column panel */}
      <div className="flex flex-col md:flex-row">
        {/* Left — dark navy */}
        <div className="flex flex-1 flex-col justify-center bg-[#1a1a5e] px-8 py-16 md:px-12">
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
            <a
              href="#"
              className="inline-block rounded-xl border-2 border-white px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#1a1a5e]"
            >
              Learn About Us
            </a>
          </div>
        </div>

        {/* Right — image placeholder */}
        <div className="flex min-h-[300px] flex-1 items-center justify-center bg-slate-200 md:min-h-[400px]">
          <span className="text-sm text-slate-400">[Image Placeholder]</span>
        </div>
      </div>

      {/* Trusted partners */}
      <div className="flex flex-col items-center gap-6 border-t border-slate-100 px-5 py-10 sm:flex-row sm:justify-between md:px-12">
        <p className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
          OUR TRUSTED PARTNERS
        </p>
        <div className="flex flex-wrap items-center justify-center gap-10">
          {PARTNERS.map((name) => (
            <div
              key={name}
              className="flex h-10 w-32 items-center justify-center rounded-lg border border-slate-200 bg-slate-50"
            >
              <span className="text-xs text-slate-400">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/landing/EducationalApproachSection.tsx
git commit -m "feat: add EducationalApproachSection with navy panel and trusted partners"
```

---

## Task 7: Create TrainingStylesSection.tsx

Two side-by-side cards for Online Face-to-Face Training and Online Self Learning.

**Files:**
- Create: `src/components/landing/TrainingStylesSection.tsx`

- [ ] **Step 1: Create TrainingStylesSection.tsx**

```tsx
const STYLES = [
  {
    title: 'Online Face-to-Face Training',
    body: 'Experience personalised learning with Tobams Group Academy through our immersive Face-to-Face training sessions. Engage directly with expert instructors, participate in hands-on activities, and collaborate with peers in a dynamic classroom environment. This approach fosters a deep understanding of the material and builds strong professional networks.',
  },
  {
    title: 'Online Self Learning',
    body: "Enjoy the flexibility of Tobams Group Academy's Online training sessions, designed for learners who prefer a virtual learning environment. Access course materials anytime, anywhere, and learn at your own pace on our LMS platform. Our online training offers interactive modules, live webinars, and virtual support, ensuring a comprehensive and convenient educational journey.",
  },
]

export function TrainingStylesSection() {
  return (
    <section className="bg-slate-50 px-5 py-16 md:px-12 md:py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-10 text-center text-2xl font-bold text-slate-900 md:text-3xl">
          Explore Our Training Styles
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {STYLES.map((style) => (
            <div key={style.title} className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
              <p className="mb-3 text-xl text-[#EF4353]">✦</p>
              <h3 className="mb-3 text-lg font-bold text-slate-900">{style.title}</h3>
              <p className="text-sm leading-relaxed text-slate-500">{style.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/landing/TrainingStylesSection.tsx
git commit -m "feat: add TrainingStylesSection with two training style cards"
```

---

## Task 8: Create HowItWorksSection.tsx

Two-column layout: image placeholder left, 4-step dot timeline right.

**Files:**
- Create: `src/components/landing/HowItWorksSection.tsx`

- [ ] **Step 1: Create HowItWorksSection.tsx**

```tsx
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
          <div className="flex min-h-[320px] flex-1 items-center justify-center rounded-2xl bg-slate-200 md:min-h-[420px]">
            <span className="text-sm text-slate-400">[Image Placeholder]</span>
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/landing/HowItWorksSection.tsx
git commit -m "feat: add HowItWorksSection with 4-step dot timeline"
```

---

## Task 9: Create TestimonialsSection.tsx

Three hardcoded student testimonial cards.

**Files:**
- Create: `src/components/landing/TestimonialsSection.tsx`

- [ ] **Step 1: Create TestimonialsSection.tsx**

```tsx
const TESTIMONIALS = [
  {
    name: 'Damilare Ismaila',
    role: 'Employed',
    stars: 4,
    quote:
      'Learning about sustainability is an eye-opener to a lot of other important topics that are related to life on the planet. Wonderful Training!',
  },
  {
    name: 'Precious Aderibigbe',
    role: 'Employed',
    stars: 5,
    quote:
      'My Experience with Sustainability Fundamentals is great and challenging, as the challenging part has helped me to improve on my knowledge about things.',
  },
  {
    name: 'Lovely Agbonlahor',
    role: 'Employed',
    stars: 4,
    quote:
      'It was a wonderful experience. It was very informative and I had a deeper knowledge of real life impacts in a global scale.',
  },
]

export function TestimonialsSection() {
  return (
    <section className="bg-slate-50 px-5 py-16 md:px-12 md:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-1 text-xs font-extrabold uppercase tracking-widest text-[#EF4353]">
              TESTIMONIALS
            </p>
            <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
              Reviews From Our Students
            </h2>
          </div>
          <a
            href="#"
            className="flex-shrink-0 rounded-xl border-2 border-[#1a1a5e] px-5 py-2.5 text-sm font-semibold text-[#1a1a5e] transition-colors hover:bg-[#1a1a5e] hover:text-white"
          >
            See All Testimonials →
          </a>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                {/* Avatar placeholder */}
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#571244] text-sm font-bold text-white">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
              <div className="mb-3 flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span
                    key={i}
                    className={`text-sm ${i <= t.stars ? 'text-yellow-400' : 'text-slate-200'}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="text-sm leading-relaxed text-slate-500">{t.quote}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/landing/TestimonialsSection.tsx
git commit -m "feat: add TestimonialsSection with 3 hardcoded student reviews"
```

---

## Task 10: Create UpcomingEventsSection.tsx

One featured large card (left) and two stacked smaller cards (right), all hardcoded.

**Files:**
- Create: `src/components/landing/UpcomingEventsSection.tsx`

- [ ] **Step 1: Create UpcomingEventsSection.tsx**

```tsx
const EVENT = {
  date: 'May 15, 2024 | 10:00 AM – 12:00 PM (UK Time)',
  title: 'Leadership Summit 2024',
  excerpt:
    'We are proud to announce that Tobams Group Academy has been recognized for its commitment to sustainable business practices. Learn more about our eco-friendly initiatives and the positive impact on our c...',
}

function SmallEventCard() {
  return (
    <div className="flex gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="h-20 w-28 flex-shrink-0 rounded-lg bg-slate-200" />
      <div>
        <p className="mb-1 text-[10px] text-slate-400">{EVENT.date}</p>
        <h4 className="mb-1 text-sm font-bold text-slate-900">{EVENT.title}</h4>
        <p className="mb-2 line-clamp-2 text-xs text-slate-500">{EVENT.excerpt}</p>
        <a href="#" className="text-xs font-semibold text-[#EF4353] hover:underline">
          Register Now
        </a>
      </div>
    </div>
  )
}

export function UpcomingEventsSection() {
  return (
    <section className="bg-white px-5 py-16 md:px-12 md:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Upcoming Events</h2>
          <a
            href="#"
            className="rounded-xl bg-[#1a1a5e] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#571244]"
          >
            View All Events →
          </a>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Featured large card */}
          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="relative flex h-56 items-center justify-center bg-slate-200">
              <span className="text-sm text-slate-400">[Image Placeholder]</span>
              {/* Play button overlay */}
              <button
                type="button"
                aria-label="Play"
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-xl text-slate-700 shadow">
                  ▶
                </div>
              </button>
            </div>
            <div className="p-5">
              <p className="mb-1 text-xs text-slate-400">{EVENT.date}</p>
              <h3 className="mb-2 text-lg font-bold text-slate-900">{EVENT.title}</h3>
              <p className="mb-3 text-sm text-slate-500">{EVENT.excerpt}</p>
              <a href="#" className="text-sm font-semibold text-[#EF4353] hover:underline">
                Register Now
              </a>
            </div>
          </div>

          {/* Two stacked smaller cards */}
          <div className="flex flex-col gap-4">
            <SmallEventCard />
            <SmallEventCard />
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/landing/UpcomingEventsSection.tsx
git commit -m "feat: add UpcomingEventsSection with featured + stacked event cards"
```

---

## Task 11: Create CTABannerSection.tsx

Full-width banner with a dark overlay over an image placeholder and an Enrol Now CTA.

**Files:**
- Create: `src/components/landing/CTABannerSection.tsx`

- [ ] **Step 1: Create CTABannerSection.tsx**

```tsx
import Link from 'next/link'

export function CTABannerSection() {
  return (
    <section className="relative overflow-hidden bg-slate-800 px-5 py-20 text-center md:px-12">
      {/* Background placeholder */}
      <div className="absolute inset-0 bg-slate-700" aria-hidden="true" />
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#1a1a5e]/70" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-2xl">
        <h2 className="mb-6 text-2xl font-bold text-white md:text-3xl">
          Ready to accelerate your career? We can&apos;t wait to have you, apply now.
        </h2>
        <Link
          href="/register"
          className="inline-block rounded-xl bg-[#EF4353] px-8 py-3.5 text-sm font-bold text-white transition-all hover:-translate-y-1 hover:opacity-90"
        >
          Enrol Now →
        </Link>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/landing/CTABannerSection.tsx
git commit -m "feat: add CTABannerSection with enrol now CTA"
```

---

## Task 12: Rewrite Footer.tsx

Add newsletter subscription bar above the main footer. Update link columns to: Academy, Quick Links, Contact.

**Files:**
- Modify: `src/components/landing/Footer.tsx`

- [ ] **Step 1: Replace Footer.tsx**

```tsx
import Link from 'next/link'

const COLUMNS = {
  Academy: [
    { label: 'About', href: '#' },
    { label: 'Courses', href: '/courses' },
    { label: 'Corporate Training', href: '#' },
  ],
  'Quick Links': [
    { label: 'Tobams Group', href: '#' },
    { label: 'Events', href: '#' },
    { label: 'FAQs', href: '#' },
  ],
}

export function Footer() {
  return (
    <footer>
      {/* Newsletter bar */}
      <div className="bg-[#1a1a5e] px-5 py-8 md:px-12">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="font-bold text-white">Subscribe To Get Updates Regarding New Courses</p>
            <p className="mt-1 text-sm text-white/60">Stay informed with the latest updates from our academy</p>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex w-full max-w-sm overflow-hidden rounded-xl border border-white/20"
          >
            <input
              type="email"
              placeholder="Enter your email..."
              className="flex-1 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none"
            />
            <button
              type="submit"
              className="flex items-center justify-center bg-[#EF4353] px-4 text-white transition-opacity hover:opacity-90"
              aria-label="Subscribe"
            >
              →
            </button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="bg-slate-900 px-5 py-12 text-slate-400 md:px-12 md:py-14">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">
            {/* Brand */}
            <div className="sm:col-span-2 md:col-span-1">
              <Link href="/" className="text-xl font-bold text-white">
                TG<span className="text-[#EF4353]">.</span>
              </Link>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Empower your knowledge journey with Tobams Group Academy — Your Gateway to
                Professional Excellence.
              </p>
            </div>

            {/* Link columns */}
            {Object.entries(COLUMNS).map(([title, items]) => (
              <div key={title}>
                <h4 className="mb-4 text-xs font-extrabold uppercase tracking-widest text-slate-500">
                  {title}
                </h4>
                <ul className="flex flex-col gap-2.5">
                  {items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="text-sm text-slate-400 transition-colors hover:text-white"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Contact */}
            <div>
              <h4 className="mb-4 text-xs font-extrabold uppercase tracking-widest text-slate-500">
                Contact
              </h4>
              <ul className="flex flex-col gap-3 text-sm text-slate-400">
                <li className="flex items-start gap-2">
                  <span>📍</span>
                  <span>64 Nile Street, International House, London N1 7SR</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>✉</span>
                  <a href="mailto:theteam@tobamsgroup.com" className="hover:text-white transition-colors">
                    theteam@tobamsgroup.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <span>📞</span>
                  <span>[Phone Placeholder]</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} Tobams Group Academy. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: No new errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/Footer.tsx
git commit -m "feat: rewrite Footer with newsletter bar and updated contact columns"
```

---

## Task 13: Update page.tsx — wire all sections

Replace `CoursesSection` import with `PopularCourses` and add all new sections in spec order.

**Files:**
- Modify: `src/app/(public)/page.tsx`
- Delete: `src/components/landing/CoursesSection.tsx`

- [ ] **Step 1: Replace page.tsx**

```tsx
import { Navbar } from '@/components/landing/Navbar'
import { Hero } from '@/components/landing/Hero'
import { StatsBar } from '@/components/landing/StatsBar'
import { PopularCourses } from '@/components/landing/PopularCourses'
import { WhyLearnSection } from '@/components/landing/WhyLearnSection'
import { CertificationPathsSection } from '@/components/landing/CertificationPathsSection'
import { InternshipSection } from '@/components/landing/InternshipSection'
import { EducationalApproachSection } from '@/components/landing/EducationalApproachSection'
import { TrainingStylesSection } from '@/components/landing/TrainingStylesSection'
import { HowItWorksSection } from '@/components/landing/HowItWorksSection'
import { TestimonialsSection } from '@/components/landing/TestimonialsSection'
import { UpcomingEventsSection } from '@/components/landing/UpcomingEventsSection'
import { CTABannerSection } from '@/components/landing/CTABannerSection'
import { Footer } from '@/components/landing/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <StatsBar />
      <PopularCourses />
      <WhyLearnSection />
      <CertificationPathsSection />
      <InternshipSection />
      <EducationalApproachSection />
      <TrainingStylesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <UpcomingEventsSection />
      <CTABannerSection />
      <Footer />
    </div>
  )
}
```

- [ ] **Step 2: Delete old CoursesSection**

```bash
rm src/components/landing/CoursesSection.tsx
```

- [ ] **Step 3: Full build to verify everything compiles**

```bash
npm run build
```

Expected: Build completes with no TypeScript or lint errors. (Warnings about `<img>` vs `next/image` can be addressed separately.)

- [ ] **Step 4: Commit**

```bash
git add src/app/(public)/page.tsx
git rm src/components/landing/CoursesSection.tsx
git commit -m "feat: wire all landing page sections in page.tsx, remove CoursesSection"
```

---

## Task 14: Fix 'use client' on Footer newsletter form

The `Footer` component uses `onSubmit` which requires a Client Component boundary.

**Files:**
- Modify: `src/components/landing/Footer.tsx`

- [ ] **Step 1: Extract newsletter form to a client component within Footer.tsx**

Add `'use client'` directive to a small inline client component for the form, keeping the rest of Footer as a Server Component. Replace the top of `Footer.tsx` with:

```tsx
'use client'

import Link from 'next/link'

function NewsletterForm() {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex w-full max-w-sm overflow-hidden rounded-xl border border-white/20"
    >
      <input
        type="email"
        placeholder="Enter your email..."
        className="flex-1 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none"
      />
      <button
        type="submit"
        className="flex items-center justify-center bg-[#EF4353] px-4 text-white transition-opacity hover:opacity-90"
        aria-label="Subscribe"
      >
        →
      </button>
    </form>
  )
}

const COLUMNS = {
  // ... rest of file unchanged
```

Actually, the simplest fix is to mark the entire `Footer.tsx` as `'use client'` since it's a leaf component with no async data needs. Add `'use client'` as the first line of `Footer.tsx`.

Full updated file:

```tsx
'use client'

import Link from 'next/link'

const COLUMNS = {
  Academy: [
    { label: 'About', href: '#' },
    { label: 'Courses', href: '/courses' },
    { label: 'Corporate Training', href: '#' },
  ],
  'Quick Links': [
    { label: 'Tobams Group', href: '#' },
    { label: 'Events', href: '#' },
    { label: 'FAQs', href: '#' },
  ],
}

export function Footer() {
  return (
    <footer>
      {/* Newsletter bar */}
      <div className="bg-[#1a1a5e] px-5 py-8 md:px-12">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="font-bold text-white">Subscribe To Get Updates Regarding New Courses</p>
            <p className="mt-1 text-sm text-white/60">Stay informed with the latest updates from our academy</p>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex w-full max-w-sm overflow-hidden rounded-xl border border-white/20"
          >
            <input
              type="email"
              placeholder="Enter your email..."
              className="flex-1 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none"
            />
            <button
              type="submit"
              className="flex items-center justify-center bg-[#EF4353] px-4 text-white transition-opacity hover:opacity-90"
              aria-label="Subscribe"
            >
              →
            </button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="bg-slate-900 px-5 py-12 text-slate-400 md:px-12 md:py-14">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">
            {/* Brand */}
            <div className="sm:col-span-2 md:col-span-1">
              <Link href="/" className="text-xl font-bold text-white">
                TG<span className="text-[#EF4353]">.</span>
              </Link>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Empower your knowledge journey with Tobams Group Academy — Your Gateway to
                Professional Excellence.
              </p>
            </div>

            {/* Link columns */}
            {Object.entries(COLUMNS).map(([title, items]) => (
              <div key={title}>
                <h4 className="mb-4 text-xs font-extrabold uppercase tracking-widest text-slate-500">
                  {title}
                </h4>
                <ul className="flex flex-col gap-2.5">
                  {items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="text-sm text-slate-400 transition-colors hover:text-white"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Contact */}
            <div>
              <h4 className="mb-4 text-xs font-extrabold uppercase tracking-widest text-slate-500">
                Contact
              </h4>
              <ul className="flex flex-col gap-3 text-sm text-slate-400">
                <li className="flex items-start gap-2">
                  <span>📍</span>
                  <span>64 Nile Street, International House, London N1 7SR</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>✉</span>
                  <a href="mailto:theteam@tobamsgroup.com" className="transition-colors hover:text-white">
                    theteam@tobamsgroup.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <span>📞</span>
                  <span>[Phone Placeholder]</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} Tobams Group Academy. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Final build**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/Footer.tsx
git commit -m "fix: add use client to Footer for newsletter form onSubmit"
```

---

## Self-Review Notes

- All 14 spec sections covered across 14 tasks (Hero, PopularCourses, WhyLearn, CertificationPaths, Internship, EducationalApproach, TrainingStyles, HowItWorks, Testimonials, UpcomingEvents, CTABanner, Footer, page.tsx wiring, Footer client fix)
- Hardcoded data used for Testimonials and UpcomingEvents per spec
- `CoursesSection.tsx` deleted in Task 13
- TypeScript check (`npx tsc --noEmit`) run after Tasks 1, 2, 12; full build after Tasks 13 and 14
- `onSubmit` in Footer addressed proactively in Task 14
- All image slots use `[Image Placeholder]` pattern per spec
- Category pill filtering and carousel arrows are UI-only per constraints
