import { PrismaClient, CourseLevel, CourseStatus, Role } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  { name: 'Business', slug: 'business' },
  { name: 'Leadership', slug: 'leadership' },
  { name: 'Data & Analytics', slug: 'data-analytics' },
  { name: 'Technology', slug: 'technology' },
  { name: 'Design', slug: 'design' },
  { name: 'Personal Development', slug: 'personal-development' },
  { name: 'Project Management', slug: 'project-management' },
  { name: 'Marketing', slug: 'marketing' },
];

async function main() {
  // Seed categories
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log(`Seeded ${categories.length} categories`);

  // Seed admin/instructor user for course ownership
  const instructor = await prisma.user.upsert({
    where: { email: 'instructor@tobams.com' },
    update: {},
    create: {
      email: 'instructor@tobams.com',
      name: 'TGA Instructor',
      passwordHash: '$2a$12$placeholder',
      role: Role.INSTRUCTOR,
      emailVerified: true,
    },
  });

  const bizCategory = await prisma.category.findUnique({ where: { slug: 'business' } });
  const dataCategory = await prisma.category.findUnique({ where: { slug: 'data-analytics' } });
  const techCategory = await prisma.category.findUnique({ where: { slug: 'technology' } });
  const leaderCategory = await prisma.category.findUnique({ where: { slug: 'leadership' } });

  const sampleCourses = [
    {
      title: 'Product Management Fundamentals',
      slug: 'product-management-fundamentals',
      description: 'Learn the core skills needed to become an effective product manager.',
      level: CourseLevel.BEGINNER,
      status: CourseStatus.PUBLISHED,
      isFeatured: true,
      categoryId: bizCategory!.id,
      instructorId: instructor.id,
      modules: ['Introduction to PM', 'User Research', 'Roadmapping', 'Stakeholder Management'],
    },
    {
      title: 'Data Analysis with Python',
      slug: 'data-analysis-python',
      description: 'Master data analysis using Python, pandas, and matplotlib.',
      level: CourseLevel.INTERMEDIATE,
      status: CourseStatus.PUBLISHED,
      isFeatured: true,
      categoryId: dataCategory!.id,
      instructorId: instructor.id,
      modules: ['Python Basics', 'Pandas Deep Dive', 'Data Visualisation', 'Case Studies'],
    },
    {
      title: 'Leadership Essentials',
      slug: 'leadership-essentials',
      description: 'Build the leadership skills that drive high-performing teams.',
      level: CourseLevel.BEGINNER,
      status: CourseStatus.PUBLISHED,
      isFeatured: true,
      categoryId: leaderCategory!.id,
      instructorId: instructor.id,
      modules: ['Leadership Styles', 'Communication', 'Conflict Resolution', 'Coaching'],
    },
    {
      title: 'Full-Stack Web Development',
      slug: 'fullstack-web-development',
      description: 'Build modern web applications from frontend to backend.',
      level: CourseLevel.INTERMEDIATE,
      status: CourseStatus.PUBLISHED,
      isFeatured: false,
      categoryId: techCategory!.id,
      instructorId: instructor.id,
      modules: ['HTML & CSS', 'JavaScript', 'React', 'Node.js & APIs'],
    },
  ];

  for (const courseData of sampleCourses) {
    const { modules: modulesTitles, ...courseFields } = courseData;
    const course = await prisma.course.upsert({
      where: { slug: courseFields.slug },
      update: {},
      create: courseFields,
    });

    // Delete existing modules (cascades to lessons) before re-seeding — idempotent
    await prisma.courseModule.deleteMany({ where: { courseId: course.id } });

    for (let i = 0; i < modulesTitles.length; i++) {
      const mod = await prisma.courseModule.create({
        data: { title: modulesTitles[i], position: i + 1, courseId: course.id },
      });

      await prisma.lesson.createMany({
        data: [
          { title: `${modulesTitles[i]} — Part 1`, position: 1, duration: 20, moduleId: mod.id },
          { title: `${modulesTitles[i]} — Part 2`, position: 2, duration: 25, moduleId: mod.id },
        ],
      });
    }
  }

  console.log(`Seeded ${sampleCourses.length} courses with modules and lessons`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
