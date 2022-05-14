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

export async function getChallengeListItems() {
  return prisma.challenge.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}

export async function getChallenge({ id }: Pick<Challenge, "id">) {
  return prisma.challenge.findFirst({
    where: { id },
    include: {
      createdBy: true,
      updatedBy: true,
      sections: true,
      challengeSections: true,
    },
  });
}

export async function addSectionToChallenge(
  challengeId: string,
  sectionId: string
) {
  return prisma.challenge.update({
    where: { id: challengeId },
    data: {
      sections: {
        connect: {
          id: sectionId,
        },
      },
    },
  });
}
