-- AlterTable
ALTER TABLE "Answer" ADD COLUMN     "requiresValidation" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "isCorrect" DROP NOT NULL;
