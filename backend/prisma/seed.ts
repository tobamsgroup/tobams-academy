import { PrismaClient } from '@prisma/client';

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
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log(`Seeded ${categories.length} categories`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
