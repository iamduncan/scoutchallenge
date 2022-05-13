import type { Challenge, Prisma } from "@prisma/client";

import { prisma } from "~/db.server";

export async function createChallenge(
  data: Prisma.ChallengeCreateInput
): Promise<Challenge> {
  return prisma.challenge.create({
    data,
  });
}

export async function listChallenges(): Promise<Challenge[]> {
  return prisma.challenge.findMany();
}

export async function getChallenge({ id }: Pick<Challenge, "id">) {
  return prisma.challenge.findFirst({
    where: { id },
    include: {
      createdBy: true,
      updatedBy: true,
    },
  });
}
