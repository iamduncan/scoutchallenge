-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "RoleType" ADD VALUE 'YOUNGPERSON';
ALTER TYPE "RoleType" ADD VALUE 'PARENT';

-- DropIndex
DROP INDEX "Answer_response_key";

-- DropIndex
DROP INDEX "Challenge_name_key";

-- DropIndex
DROP INDEX "ChallengeSection_title_key";

-- DropIndex
DROP INDEX "Question_title_key";

-- DropIndex
DROP INDEX "Section_name_key";
