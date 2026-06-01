import { PrismaClient } from '@prisma/client'

const createPrismaClient = () => new PrismaClient()

/** Singleton Prisma client — type is inferred from generated client (includes `notification`). */
export type AppPrismaClient = ReturnType<typeof createPrismaClient>

const globalForPrisma = globalThis as unknown as {
  prisma?: AppPrismaClient
}

export const prisma: AppPrismaClient = globalForPrisma.prisma ?? createPrismaClient()

/** Notification model delegate (explicit export for stable typing in API routes). */
export const notificationDb = prisma.notification

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
