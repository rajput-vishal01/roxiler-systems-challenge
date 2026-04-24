/*
  Warnings:

  - Added the required column `address` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER', 'STORE_OWNER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" VARCHAR(400) NOT NULL,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';
