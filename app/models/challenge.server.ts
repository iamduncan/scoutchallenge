import type { Challenge, Prisma } from "@prisma/client";

import { prisma } from "~/db.server";
import { generateHTML } from "~/utils.server";

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

/**
 * Get a list of challenges for a given user.
 *
 * @param published true to return only published challenges
 * @returns list of challenges
 */
export async function getChallengeListItems(
  published?: boolean
): Promise<Pick<Challenge, "id" | "name">[]> {
  return prisma.challenge.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
    where: published ? { status: "PUBLISHED" } : undefined,
  });
}

export async function getChallenge({ id }: Pick<Challenge, "id">) {
  const challenge = await prisma.challenge.findFirst({
    where: { id },
    include: {
      createdBy: true,
      updatedBy: true,
      sections: true,
      challengeSections: true,
    },
  });

  if (!challenge) {
    throw new Error("Challenge not found");
  }

  // console.log(challenge.introduction);
  const introHtml = generateHTML(challenge.introduction || "");

  return {
    ...challenge,
    introductionHtml: introHtml,
  };
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

export async function removeSectionFromChallenge(
  challengeId: string,
  sectionId: string
) {
  return prisma.challenge.update({
    where: { id: challengeId },
    data: {
      sections: {
        disconnect: {
          id: sectionId,
        },
      },
    },
  });
}

export async function deleteChallenge({ id }: Pick<Challenge, "id">) {
  return prisma.challenge.delete({
    where: { id },
  });
}
