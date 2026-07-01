import { PrismaClient } from '@prisma/client'

const createPrismaClient = () => new PrismaClient()

/** Singleton Prisma client — use PrismaClient directly so generated model types stay in sync. */
export type AppPrismaClient = PrismaClient

const globalForPrisma = globalThis as unknown as {
  prisma?: AppPrismaClient
}

export const prisma: AppPrismaClient = globalForPrisma.prisma ?? createPrismaClient()

/** Notification model delegate (explicit export for stable typing in API routes). */
export const notificationDb = prisma.notification

/** Quiz model delegates (explicit exports for stable typing in API routes). */
export const quizDb = prisma.quiz
export const quizQuestionDb = prisma.quizQuestion
export const quizOptionDb = prisma.quizOption
export const quizAttemptDb = prisma.quizAttempt
export const lessonDb = prisma.lesson
export const paymentDb = prisma.payment

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
