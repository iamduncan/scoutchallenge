-- CreateEnum
CREATE TYPE "ChallengeType" AS ENUM ('STANDARD', 'LIVE', 'TEAM', 'CONTEST');

-- AlterTable
ALTER TABLE "Challenge" ADD COLUMN     "type" "ChallengeType" NOT NULL DEFAULT 'STANDARD';
