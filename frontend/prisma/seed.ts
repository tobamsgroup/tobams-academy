import { PrismaClient, CourseLevel, CourseStatus, Role, LessonKind } from '@prisma/client';

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

type LessonSeed = { title: string; duration: number; kind: LessonKind; contentKey?: string };
type ModuleSeed = { title: string; lessons: LessonSeed[] };

const sampleCourses = [
  {
    title: 'Product Management Fundamentals',
    slug: 'product-management-fundamentals',
    description: 'Learn the core skills needed to become an effective product manager.',
    level: CourseLevel.BEGINNER,
    status: CourseStatus.PUBLISHED,
    isFeatured: true,
    categorySlug: 'business',
    modules: [
      {
        title: 'Module 1: Introduction to PM',
        lessons: [
          { title: 'What is Product Management?', duration: 5, kind: LessonKind.VIDEO, contentKey: 'pm-intro' },
          { title: 'The PM Role & Responsibilities', duration: 7, kind: LessonKind.DOC },
          { title: 'Quiz 1: PM Basics', duration: 10, kind: LessonKind.QUIZ, contentKey: 'pm-basics-quiz' },
        ],
      },
      {
        title: 'Module 2: User Research',
        lessons: [
          { title: 'Understanding Your Users', duration: 8, kind: LessonKind.VIDEO },
          { title: 'User Interview Techniques', duration: 10, kind: LessonKind.SCREEN },
          { title: 'Research Findings PDF', duration: 5, kind: LessonKind.PDF },
        ],
      },
      {
        title: 'Module 3: Roadmapping',
        lessons: [
          { title: 'Building Your Roadmap', duration: 12, kind: LessonKind.VIDEO },
          { title: 'Prioritisation Frameworks', duration: 8, kind: LessonKind.DOC },
          { title: 'Assessment: Roadmap Exercise', duration: 20, kind: LessonKind.ASSESSMENT },
        ],
      },
      {
        title: 'Module 4: Stakeholder Management',
        lessons: [
          { title: 'Managing Up', duration: 9, kind: LessonKind.VIDEO },
          { title: 'Cross-functional Collaboration', duration: 7, kind: LessonKind.VIDEO },
        ],
      },
    ] satisfies ModuleSeed[],
  },
  {
    title: 'Data Analysis with Python',
    slug: 'data-analysis-python',
    description: 'Master data analysis using Python, pandas, and matplotlib.',
    level: CourseLevel.INTERMEDIATE,
    status: CourseStatus.PUBLISHED,
    isFeatured: true,
    categorySlug: 'data-analytics',
    modules: [
      {
        title: 'Module 1: Python Basics',
        lessons: [
          { title: 'Python Environment Setup', duration: 5, kind: LessonKind.VIDEO, contentKey: 'python-setup' },
          { title: 'Variables & Data Types', duration: 8, kind: LessonKind.VIDEO },
          { title: 'Control Flow', duration: 10, kind: LessonKind.SCREEN },
          { title: 'Quiz 1: Python Fundamentals', duration: 10, kind: LessonKind.QUIZ, contentKey: 'python-basics-quiz' },
        ],
      },
      {
        title: 'Module 2: Pandas Deep Dive',
        lessons: [
          { title: 'DataFrames & Series', duration: 12, kind: LessonKind.VIDEO },
          { title: 'Data Cleaning Techniques', duration: 15, kind: LessonKind.SCREEN },
          { title: 'Pandas Cheat Sheet', duration: 3, kind: LessonKind.PDF },
        ],
      },
      {
        title: 'Module 3: Data Visualisation',
        lessons: [
          { title: 'Matplotlib Fundamentals', duration: 10, kind: LessonKind.VIDEO },
          { title: 'Seaborn for Statistical Plots', duration: 12, kind: LessonKind.SCREEN },
          { title: 'Assessment: Visualisation Project', duration: 30, kind: LessonKind.ASSESSMENT },
        ],
      },
      {
        title: 'Module 4: Case Studies',
        lessons: [
          { title: 'Sales Data Analysis', duration: 20, kind: LessonKind.VIDEO },
          { title: 'Final Quiz', duration: 15, kind: LessonKind.QUIZ, contentKey: 'data-final-quiz' },
        ],
      },
    ] satisfies ModuleSeed[],
  },
  {
    title: 'Leadership Essentials',
    slug: 'leadership-essentials',
    description: 'Build the leadership skills that drive high-performing teams.',
    level: CourseLevel.BEGINNER,
    status: CourseStatus.PUBLISHED,
    isFeatured: true,
    categorySlug: 'leadership',
    modules: [
      {
        title: 'Module 1: Leadership Styles',
        lessons: [
          { title: 'Types of Leadership', duration: 6, kind: LessonKind.VIDEO, contentKey: 'leadership-intro' },
          { title: 'Situational Leadership', duration: 8, kind: LessonKind.DOC },
          { title: 'Quiz 1: Leadership Styles', duration: 10, kind: LessonKind.QUIZ, contentKey: 'leadership-styles-quiz' },
        ],
      },
      {
        title: 'Module 2: Communication',
        lessons: [
          { title: 'Active Listening', duration: 7, kind: LessonKind.VIDEO },
          { title: 'Giving Effective Feedback', duration: 9, kind: LessonKind.SCREEN },
        ],
      },
      {
        title: 'Module 3: Conflict Resolution',
        lessons: [
          { title: 'Understanding Conflict', duration: 8, kind: LessonKind.VIDEO },
          { title: 'De-escalation Techniques', duration: 10, kind: LessonKind.VIDEO },
          { title: 'Case Study PDF', duration: 5, kind: LessonKind.PDF },
        ],
      },
      {
        title: 'Module 4: Coaching',
        lessons: [
          { title: 'Coaching vs Mentoring', duration: 7, kind: LessonKind.VIDEO },
          { title: 'GROW Model Workshop', duration: 15, kind: LessonKind.SCREEN },
          { title: 'Final Assessment', duration: 25, kind: LessonKind.ASSESSMENT },
        ],
      },
    ] satisfies ModuleSeed[],
  },
  {
    title: 'Full-Stack Web Development',
    slug: 'fullstack-web-development',
    description: 'Build modern web applications from frontend to backend.',
    level: CourseLevel.INTERMEDIATE,
    status: CourseStatus.PUBLISHED,
    isFeatured: false,
    categorySlug: 'technology',
    modules: [
      {
        title: 'Module 1: HTML & CSS',
        lessons: [
          { title: 'HTML Document Structure', duration: 8, kind: LessonKind.VIDEO, contentKey: 'html-intro' },
          { title: 'CSS Selectors & Box Model', duration: 10, kind: LessonKind.VIDEO },
          { title: 'Flexbox & Grid', duration: 12, kind: LessonKind.SCREEN },
          { title: 'Quiz 1: HTML & CSS', duration: 10, kind: LessonKind.QUIZ, contentKey: 'html-css-quiz' },
        ],
      },
      {
        title: 'Module 2: JavaScript',
        lessons: [
          { title: 'JS Fundamentals', duration: 15, kind: LessonKind.VIDEO },
          { title: 'Async JavaScript', duration: 12, kind: LessonKind.SCREEN },
          { title: 'JS Reference PDF', duration: 5, kind: LessonKind.PDF },
        ],
      },
      {
        title: 'Module 3: React',
        lessons: [
          { title: 'Components & Props', duration: 14, kind: LessonKind.VIDEO },
          { title: 'State & Hooks', duration: 16, kind: LessonKind.SCREEN },
          { title: 'Assessment: Build a UI', duration: 45, kind: LessonKind.ASSESSMENT },
        ],
      },
      {
        title: 'Module 4: Node.js & APIs',
        lessons: [
          { title: 'REST API Design', duration: 12, kind: LessonKind.VIDEO },
          { title: 'Express.js Setup', duration: 10, kind: LessonKind.SCREEN },
          { title: 'Final Quiz', duration: 15, kind: LessonKind.QUIZ, contentKey: 'fullstack-final-quiz' },
        ],
      },
    ] satisfies ModuleSeed[],
  },
];

// Quiz seed data — one quiz per course's first QUIZ lesson
const quizSeeds: Record<string, {
  timeLimit: number;
  passingScore: number;
  attemptsAllowed: number;
  questions: { text: string; options: { text: string; isCorrect: boolean }[] }[];
}> = {
  'pm-basics-quiz': {
    timeLimit: 10,
    passingScore: 70,
    attemptsAllowed: 2,
    questions: [
      {
        text: 'What is the primary responsibility of a Product Manager?',
        options: [
          { text: 'Writing code', isCorrect: false },
          { text: 'Defining product vision and strategy', isCorrect: true },
          { text: 'Managing the engineering team', isCorrect: false },
          { text: 'Handling customer support', isCorrect: false },
        ],
      },
      {
        text: 'Which framework is commonly used for prioritisation in product management?',
        options: [
          { text: 'RICE', isCorrect: true },
          { text: 'SWOT', isCorrect: false },
          { text: 'PESTLE', isCorrect: false },
          { text: 'Agile', isCorrect: false },
        ],
      },
      {
        text: 'What does MVP stand for?',
        options: [
          { text: 'Most Valuable Product', isCorrect: false },
          { text: 'Minimum Viable Product', isCorrect: true },
          { text: 'Maximum Value Proposition', isCorrect: false },
          { text: 'Minimum Value Plan', isCorrect: false },
        ],
      },
    ],
  },
  'python-basics-quiz': {
    timeLimit: 12,
    passingScore: 70,
    attemptsAllowed: 3,
    questions: [
      {
        text: 'Which of the following is used to define a function in Python?',
        options: [
          { text: 'function', isCorrect: false },
          { text: 'def', isCorrect: true },
          { text: 'fn', isCorrect: false },
          { text: 'define', isCorrect: false },
        ],
      },
      {
        text: 'What is the output of `print(type(3.14))`?',
        options: [
          { text: '<class \'int\'>', isCorrect: false },
          { text: '<class \'float\'>', isCorrect: true },
          { text: '<class \'double\'>', isCorrect: false },
          { text: '<class \'number\'>', isCorrect: false },
        ],
      },
      {
        text: 'Which data structure uses key-value pairs in Python?',
        options: [
          { text: 'List', isCorrect: false },
          { text: 'Tuple', isCorrect: false },
          { text: 'Dictionary', isCorrect: true },
          { text: 'Set', isCorrect: false },
        ],
      },
    ],
  },
  'leadership-styles-quiz': {
    timeLimit: 10,
    passingScore: 65,
    attemptsAllowed: 2,
    questions: [
      {
        text: 'Which leadership style involves the leader making decisions without team input?',
        options: [
          { text: 'Democratic', isCorrect: false },
          { text: 'Autocratic', isCorrect: true },
          { text: 'Laissez-faire', isCorrect: false },
          { text: 'Transformational', isCorrect: false },
        ],
      },
      {
        text: 'Situational leadership suggests that leaders should adapt their style based on what?',
        options: [
          { text: 'Their personal preference', isCorrect: false },
          { text: 'Company policy', isCorrect: false },
          { text: 'The team member\'s competence and commitment', isCorrect: true },
          { text: 'The urgency of the task', isCorrect: false },
        ],
      },
      {
        text: 'Transformational leadership primarily focuses on:',
        options: [
          { text: 'Transactional rewards', isCorrect: false },
          { text: 'Inspiring and motivating followers toward a shared vision', isCorrect: true },
          { text: 'Strictly following established processes', isCorrect: false },
          { text: 'Delegating all decisions to the team', isCorrect: false },
        ],
      },
    ],
  },
  'html-css-quiz': {
    timeLimit: 10,
    passingScore: 70,
    attemptsAllowed: 2,
    questions: [
      {
        text: 'Which HTML element is used to define the largest heading?',
        options: [
          { text: '<h6>', isCorrect: false },
          { text: '<heading>', isCorrect: false },
          { text: '<h1>', isCorrect: true },
          { text: '<head>', isCorrect: false },
        ],
      },
      {
        text: 'In CSS, which property is used to change the text colour?',
        options: [
          { text: 'font-color', isCorrect: false },
          { text: 'text-color', isCorrect: false },
          { text: 'color', isCorrect: true },
          { text: 'foreground', isCorrect: false },
        ],
      },
      {
        text: 'What does CSS stand for?',
        options: [
          { text: 'Cascading Style Sheets', isCorrect: true },
          { text: 'Creative Style System', isCorrect: false },
          { text: 'Computer Style Sheets', isCorrect: false },
          { text: 'Colorful Style Syntax', isCorrect: false },
        ],
      },
    ],
  },
};

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

  // Seed instructor
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

  // Seed demo learner
  const learner = await prisma.user.upsert({
    where: { email: 'learner@tobams.com' },
    update: {},
    create: {
      email: 'learner@tobams.com',
      name: 'Demo Learner',
      passwordHash: '$2a$12$placeholder',
      role: Role.LEARNER,
      emailVerified: true,
    },
  });

  // Seed courses with full module + lesson data
  for (const courseData of sampleCourses) {
    const category = await prisma.category.findUniqueOrThrow({ where: { slug: courseData.categorySlug } });
    const { modules: modulesData, categorySlug: _, ...courseFields } = courseData;

    const course = await prisma.course.upsert({
      where: { slug: courseFields.slug },
      update: { title: courseFields.title, description: courseFields.description },
      create: { ...courseFields, categoryId: category.id, instructorId: instructor.id },
    });

    // Delete existing modules (cascades to lessons/quizzes) before re-seeding
    await prisma.courseModule.deleteMany({ where: { courseId: course.id } });

    for (let mi = 0; mi < modulesData.length; mi++) {
      const modData = modulesData[mi]!;
      const mod = await prisma.courseModule.create({
        data: { title: modData.title, position: mi + 1, courseId: course.id },
      });

      for (let li = 0; li < modData.lessons.length; li++) {
        const lessonData = modData.lessons[li] as LessonSeed;
        const lesson = await prisma.lesson.create({
          data: {
            title: lessonData.title,
            position: li + 1,
            duration: lessonData.duration,
            kind: lessonData.kind,
            contentKey: lessonData.contentKey ?? null,
            moduleId: mod.id,
          },
        });

        // Seed quiz for QUIZ-kind lessons that have quiz data
        if (lessonData.kind === LessonKind.QUIZ && lessonData.contentKey) {
          const quizSeed = quizSeeds[lessonData.contentKey];
          if (quizSeed) {
            const quiz = await prisma.quiz.create({
              data: {
                lessonId: lesson.id,
                timeLimit: quizSeed.timeLimit,
                passingScore: quizSeed.passingScore,
                attemptsAllowed: quizSeed.attemptsAllowed,
              },
            });

            for (let qi = 0; qi < quizSeed.questions.length; qi++) {
              const qData = quizSeed.questions[qi]!;
              const question = await prisma.quizQuestion.create({
                data: { quizId: quiz.id, text: qData.text, position: qi + 1 },
              });
              await prisma.quizOption.createMany({
                data: qData.options.map((opt, oi) => ({
                  questionId: question.id,
                  text: opt.text,
                  isCorrect: opt.isCorrect,
                  position: oi + 1,
                })),
              });
            }
          }
        }
      }
    }

    console.log(`Seeded course: ${course.title}`);

    // Demo enrollment: enroll learner in first 2 courses with some progress
    if (courseData.slug === 'product-management-fundamentals' || courseData.slug === 'data-analysis-python') {
      const enrollment = await prisma.enrollment.upsert({
        where: { userId_courseId: { userId: learner.id, courseId: course.id } },
        update: { lastAccessedAt: new Date() },
        create: { userId: learner.id, courseId: course.id, lastAccessedAt: new Date() },
      });

      // Mark first 2 lessons complete for demo progress
      const firstModule = await prisma.courseModule.findFirst({
        where: { courseId: course.id },
        orderBy: { position: 'asc' },
        include: { lessons: { orderBy: { position: 'asc' }, take: 2 } },
      });

      if (firstModule) {
        for (const lesson of firstModule.lessons) {
          await prisma.lessonProgress.upsert({
            where: { enrollmentId_lessonId: { enrollmentId: enrollment.id, lessonId: lesson.id } },
            update: {},
            create: { enrollmentId: enrollment.id, lessonId: lesson.id },
          });
        }
      }
    }
  }

  console.log('Seeding complete');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
