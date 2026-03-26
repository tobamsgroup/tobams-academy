# Landing Page Update — Design Spec
**Date:** 2026-03-26
**Status:** Approved

## Overview

Full rebuild of the Tobams Group Academy landing page to match the reference design (`frontend/public/Home (1).png`). All new sections are added as standalone components in `src/components/landing/`. Existing components (Hero, CoursesSection) are replaced. Colors, structure, and copy match the reference image exactly. Images are placeholders to be swapped manually.

---

## Architecture

**File:** `src/app/(public)/page.tsx` — Server Component, composes all sections in order.

All components live in `src/components/landing/`.

### Section Order
1. `Navbar` — keep, no structural changes
2. `Hero` — **rewrite**
3. `StatsBar` — keep, minor copy review
4. `PopularCourses` — **rewrite** (replaces `CoursesSection`)
5. `WhyLearnSection` — **NEW**
6. `CertificationPathsSection` — **NEW**
7. `InternshipSection` — **NEW**
8. `EducationalApproachSection` — **NEW**
9. `TrainingStylesSection` — **NEW**
10. `HowItWorksSection` — **NEW**
11. `TestimonialsSection` — **NEW** (hardcoded data)
12. `UpcomingEventsSection` — **NEW** (hardcoded data)
13. `CTABannerSection` — **NEW**
14. `Footer` — **rewrite** (add newsletter bar, update columns)

No changes to routing, API layer, Redux, or auth.

---

## Brand Colors

Use existing globals:
- **Primary:** `#571244` (deep purple) — section backgrounds, buttons
- **Secondary:** `#EF4353` (red/coral) — accent labels, links, icons
- **Dark navy:** `#1a1a5e` — educational approach background, button fills
- **White / light grey:** section backgrounds

---

## Component Specs

### Hero (rewrite `Hero.tsx`)
- Two-column layout (50/50 on desktop, stacked on mobile)
- **Left:**
  - Headline: *"Grow Faster. Learn Smarter."*
  - Subtext: *"Gain industry-recognised skills with expert-led courses, flexible learning, and TGA-certified programmes."*
  - CTAs: `Start Free Trial` (primary filled) + `Browse Courses` (outlined)
  - Social proof: avatar stack + *"5,000+ learners already enrolled"*
- **Right:** Grey placeholder box (aspect-ratio ~4:3), labeled `[Image Placeholder]`

---

### StatsBar (keep `StatsBar.tsx`)
- 4 metrics: 5K+ Active Learners | 50+ Expert Courses | 98% Satisfaction Rate | 12+ Categories
- Primary `#571244` background, white text

---

### PopularCourses (rewrite `CoursesSection.tsx` → rename to `PopularCourses.tsx`)
- Label: `FEATURED` (accent color), Heading: *"Popular Courses"*
- Category pills row: `IT Service | Entrepreneurship | Sustainability | Career | Leadership | Explore all categories →` (last item in accent color, links to `/courses`)
- Course cards fetched from existing `/api/v1/courses/featured` (server component, ISR 300s)
- Card layout: image placeholder, provider name (*Tobams Group Academy*), star rating (⭐), title, short description, strikethrough price + current price, `Add to Cart` button
- 3-col desktop / 2-col tablet / 1-col mobile grid
- Prev/next arrow buttons bottom right
- `Explore All Courses →` button centered below (dark navy fill)

---

### WhyLearnSection (NEW `WhyLearnSection.tsx`)
- Label: `TOP VALUES` (accent color, centered)
- Heading: *"Why Learn With Tobams Group Academy"* (centered)
- 4 stacked rows, each: illustration placeholder (left) + title + paragraph (right), separated by `<hr />`
  1. **Certified Programs** — *"Our industry-recognised certifications open up a world of opportunities, delivering transformative learning experiences tailored to your aspirations."*
  2. **Flexible Learning Options** — *"Study at your own pace, anytime and anywhere. Our self-paced learning platform allows you to progress through the material at your speed. This flexibility accommodates your individual schedule and commitments, ensuring you can fully engage with the content comfortably."*
  3. **Extensive Course Selection** — *"Access over 200 diverse courses tailored to your needs. Our platform offers prestigious certified courses, catering to various interests and professional requirements. Explore a wide range of courses across different domains and industries, allowing you to choose what best aligns with your goals."*
  4. **Community and Networking** — *"We encourage community engagement, networking opportunities, and collaboration through forums, Q&A sessions, and other interactive features. Join a vibrant community of learners and professionals, and enrich your educational experience through meaningful connections and shared knowledge."*

---

### CertificationPathsSection (NEW `CertificationPathsSection.tsx`)
- Full-width, `#571244` background, white text
- Heading: *"Flexible Paths to Certification with Tobams Group Academy"*
- Subtext: *"At Tobams Group Academy, we offer a range of flexible options to cater to your learning preferences. Whether you choose to enrol in one of our comprehensive courses or aim for certification, we provide the right approach for you."*
- White rounded card inset:
  - Heading: *"Enrol in Our Programs"* (accent color `#EF4353`)
  - Subtext: *"Our expertly crafted courses are designed to cover a variety of key areas, some of which are TGA-certified. Gain the following benefits:"*
  - Bullet list:
    - **Comprehensive Training:** Access engaging and thorough training materials, some aligned with TGA certification requirements and others focused on our exclusive curriculum
    - **Expert Guidance:** Learn from industry experts and certified trainers committed to your success.
    - **Interactive Learning:** Participate in interactive learning experiences, group discussions, and practical exercises to reinforce your understanding.
    - **Exam Preparation:** For those seeking certification, receive targeted exam preparation to boost your confidence and readiness.
  - `Explore All Courses →` button (dark navy fill)

---

### InternshipSection (NEW `InternshipSection.tsx`)
- White background
- Heading: *"Internship Opportunities at TGA: Empowering Future Professionals"*
- Subtext: *"The TGA certified courses offers exclusive internship opportunities that provide hands-on experience, global exposure, and additional training to shape you into a well-rounded professional."*
- `Key Benefits` label (accent color)
- 2×2 grid of grey benefit cards:
  1. **Skill Enhancement** — *"Hands-on projects provide practical application, refining your business analysis skills for real-world success."*
  2. **Global Team Collaboration** — *"Work alongside professionals from around the world, experiencing the dynamics of a global team and enhancing your cross-cultural communication abilities."*
  3. **Networking Opportunities** — *"Build connections within your industry, expanding your professional network for future career opportunities."*
  4. **Additional Training** — *"Access specialised workshops in agile methodologies and leadership, ensuring you're equipped with the skills needed for success in the dynamic field of business analysis."*
- `Explore Courses` button centered (dark navy fill)

---

### EducationalApproachSection (NEW `EducationalApproachSection.tsx`)
- Two-column layout
- **Left (dark navy bg, white text):**
  - Heading: *"Our Educational Approach"*
  - Para 1: *"Our Educational Approach is centered on the highest standards of excellence and innovation, aligned with the prestigious TGA Certification. We integrate industry-specific knowledge with practical application, offering a dynamic learning experience tailored to match TGA-certified standards."*
  - Para 2: *"Our commitment to our certified courses ensures that learners acquire specialised skills, setting them on a path toward professional success and industry recognition."*
  - `Learn About Us` outlined button
- **Right:** Rectangular image placeholder
- Below (full-width): `OUR TRUSTED PARTNERS` label + 3 logo placeholders (Tobams Group, Tobams Logic, Life Newton)

---

### TrainingStylesSection (NEW `TrainingStylesSection.tsx`)
- White/light background
- Heading: *"Explore Our Training Styles"*
- Two side-by-side cards, each with pink `✦` accent icon:
  1. **Online Face-to-Face Training** — *"Experience personalised learning with Tobams Group Academy through our immersive Face-to-Face training sessions. Engage directly with expert instructors, participate in hands-on activities, and collaborate with peers in a dynamic classroom environment. This approach fosters a deep understanding of the material and builds strong professional networks."*
  2. **Online Self Learning** — *"Enjoy the flexibility of Tobams Group Academy's Online training sessions, designed for learners who prefer a virtual learning environment. Access course materials anytime, anywhere, and learn at your own pace on our LMS platform. Our online training offers interactive modules, live webinars, and virtual support, ensuring a comprehensive and convenient educational journey."*

---

### HowItWorksSection (NEW `HowItWorksSection.tsx`)
- Heading: *"How It Works"*
- Two-column layout
- **Left:** rectangular image placeholder (students in classroom setting)
- **Right:** 4 vertical steps connected by a pink/accent dot timeline:
  1. **Explore our Courses** — *"Browse through our extensive catalog of courses spanning various domains and industries. Choose the course that aligns with your goals and interests."*
  2. **Enrol in a Course** — *"Enrol in your chosen course to unlock a world of knowledge. Our enrolment process is user-friendly and seamless, ensuring you can begin learning right away."*
  3. **Learn at Your Own Pace** — *"Tobams Group Academy offers unmatched flexibility. Learn at your own pace, fitting studies into your schedule. Engage with instructors and peers through forums, Q&A sessions, and community activities. Share insights and gain diverse perspectives."*
  4. **Earn Certificates** — *"Upon successful completion of a course, earn a certificate that showcases your accomplishment. Use this credential to stand out in your field."*

---

### TestimonialsSection (NEW `TestimonialsSection.tsx`)
- Label: `TESTIMONIALS` (accent color)
- Heading: *"Reviews From Our Students"* + `See All Testimonials →` button (outlined, right-aligned)
- 3 hardcoded cards (avatar placeholder, name, role, star rating, quote):
  1. **Damilare Ismaila** | Employed | ⭐⭐⭐⭐ | *"Learning about sustainability is an eye-opener to a lot of other important topics that are related to life on the planet. Wonderful Training!"*
  2. **Precious Aderibigbe** | Employed | ⭐⭐⭐⭐⭐ | *"My Experience with Sustainability Fundamentals is great and challenging, as the challenging part has helped me to improve on my knowledge about things"*
  3. **Lovely Agbonlahor** | Employed | ⭐⭐⭐⭐ | *"It was a wonderful experience. It was very informative and I had a deeper knowledge of real life impacts in a global scale."*

---

### UpcomingEventsSection (NEW `UpcomingEventsSection.tsx`)
- Heading: *"Upcoming Events"* + `View All Events →` button (dark navy fill, right-aligned)
- Layout: 1 large featured card (left) + 2 stacked smaller cards (right)
- All 3 hardcoded with same event data:
  - Date: *May 15, 2024 | 10:00 AM – 12:00 PM (UK Time)*
  - Title: **Leadership Summit 2024**
  - Excerpt: *"We are proud to announce that Tobams Group Academy has been recognized for its commitment to sustainable business practices. Learn more about our eco-friendly initiatives and the positive impact on our c..."*
  - `Register Now` link (accent color)
  - Image placeholder (large card has play button overlay)

---

### CTABannerSection (NEW `CTABannerSection.tsx`)
- Full-width section, image placeholder background with dark overlay
- Centered text:
  - Heading: *"Ready to accelerate your career? We can't wait to have you, apply now."*
  - `Enrol Now →` button (accent color `#EF4353` fill)

---

### Footer (rewrite `Footer.tsx`)
- **Newsletter bar** (above main footer, dark navy bg):
  - Text: *"Subscribe To Get Updates Regarding New Courses"*
  - Subtext: *"Stay informed with the latest updates from our academy"*
  - Email input + submit arrow button
- **Main footer** (dark slate bg):
  - Logo (`TG` monogram) + tagline: *"Empower your knowledge journey with Tobams Group Academy — Your Gateway to Professional Excellence."*
  - **Academy column:** About, Courses, Corporate Training
  - **Quick Links column:** Tobams Group, Events, FAQs
  - **Contact column:** 📍 64 Nile Street, International House, London N1 7SR | ✉ theteam@tobamsgroup.com | phone placeholder
- Bottom bar: copyright text

---

## Constraints & Non-Goals

- No new API endpoints — courses fetched from existing `/api/v1/courses/featured`
- Testimonials, events, partner logos, and all images are hardcoded/placeholder
- No new routes, auth changes, or state management changes
- Category pill filtering is UI-only (no API call on pill click) for now
- Carousel arrow buttons are UI-only (no active slide state needed for initial implementation)
