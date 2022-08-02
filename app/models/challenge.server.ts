import type { Challenge, ChallengeSection, Prisma } from "@prisma/client";

import { prisma } from "~/db.server";
import { generateHTML } from "~/utils.server";

export async function createChallenge(
  data: Prisma.ChallengeCreateInput
): Promise<Challenge> {
  return prisma.challenge.create({
    data,
  });
}

export async function updateChallenge(
  id: string,
  data: Prisma.ChallengeUpdateInput
): Promise<Challenge> {
  return prisma.challenge.update({
    where: { id },
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
      challengeSections: {
        include: {
          questions: {
            orderBy: { order: "asc" },
            select: { id: true, title: true, description: true },
          },
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!challenge) {
    throw new Error("Challenge not found");
  }

  const introHtml = generateHTML(challenge.introduction || "");

  // generate HTML for each section description
  let challengeSections = [];
  for (const section in challenge.challengeSections) {
    if (
      Object.prototype.hasOwnProperty.call(challenge.challengeSections, section)
    ) {
      challengeSections.push({
        ...challenge.challengeSections[section],
        descriptionHtml: generateHTML(
          challenge.challengeSections[section].description || ""
        ),
      });
    }
  }

  return {
    ...challenge,
    challengeSections,
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

export async function createChallengeSection(
  challengeId: string,
  data: Prisma.ChallengeSectionCreateWithoutChallengeInput
): Promise<Challenge> {
  return prisma.challenge.update({
    where: { id: challengeId },
    data: {
      challengeSections: {
        create: [data],
      },
    },
  });
}

export async function getChallengeSection({
  id,
}: Pick<ChallengeSection, "id">) {
  return prisma.challengeSection.findFirst({
    where: { id },
    include: {
      questions: {
        orderBy: { order: "asc" },
      },
    },
  });
}

export async function addQuestion(
  challengeSectionId: string,
  questionData: Prisma.QuestionCreateWithoutChallengeSectionInput
) {
  return prisma.question.create({
    data: {
      ...questionData,
      challengeSection: {
        connect: {
          id: challengeSectionId,
        },
      },
    },
  });
}
