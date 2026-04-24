import { PrismaClient } from "@prisma/client";

const globalForPrisma = global;

// Prevent multiple instances in dev due to hot reload
const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query", "warn", "error"], // remove in prod
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;