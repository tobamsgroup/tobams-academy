import './load-env'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export { prisma }
export const lessonDb = prisma.lesson
export const quizDb = prisma.quiz
export const quizQuestionDb = prisma.quizQuestion
export const quizOptionDb = prisma.quizOption
