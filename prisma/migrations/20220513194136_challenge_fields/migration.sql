/*
  Warnings:

  - Added the required column `createdById` to the `Challenge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedById` to the `Challenge` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ChallengeStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'CLOSED', 'DELETED');

-- AlterTable
ALTER TABLE "Challenge" ADD COLUMN     "closeDate" TIMESTAMP(3),
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "openDate" TIMESTAMP(3),
ADD COLUMN     "status" "ChallengeStatus" NOT NULL DEFAULT E'DRAFT',
ADD COLUMN     "updatedById" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
