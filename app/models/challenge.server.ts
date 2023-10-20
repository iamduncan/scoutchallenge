import type {
  Challenge,
  ChallengeSection,
  Group,
  Prisma,
  Question,
} from "@prisma/client";
import { ChallengeStatus } from "@prisma/client";

import { prisma } from "#app/utils/db.server.ts";
import { generateHTML } from "#app/utils/editor.server.ts";

export async function createChallenge(
  data: Prisma.ChallengeCreateInput,
): Promise<Challenge> {
  return prisma.challenge.create({
    data,
  });
}

export async function updateChallenge(
  id: string,
  data: Prisma.ChallengeUpdateInput,
): Promise<Challenge> {
  return prisma.challenge.update({
    where: { id },
    data,
  });
}

export async function listChallenges({
  groupId,
  isAdmin,
}: {
  groupId: string;
  isAdmin?: boolean;
}): Promise<Challenge[]> {
  return prisma.challenge.findMany({
    where: isAdmin ? undefined : { groupId },
  });
}

/**
 * Get a list of challenges for a given user.
 *
 * @param published true to return only published challenges
 * @returns list of challenges
 */
export async function getChallengeListItems({
  groups,
  published,
}: {
  groups?: { id: string; name: string }[];
  published?: boolean;
}): Promise<Pick<Challenge, "id" | "name">[]> {
  return prisma.challenge.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
    where: {
      groupId: groups?.length
        ? { in: groups.map((group) => group.id) }
        : undefined,
      status: published ? ChallengeStatus.PUBLISHED : undefined,
    },
  });
}

export async function getChallenge({
  id,
  groups,
}: {
  id: Challenge["id"];
  groups?: Group[];
}) {
  const challenge = await prisma.challenge.findFirst({
    where: {
      id,
      groupId: groups?.length
        ? { in: groups.map((group) => group.id) }
        : undefined,
    },
    include: {
      createdBy: true,
      updatedBy: true,
      sections: true,
      challengeSections: {
        include: {
          questions: {
            orderBy: { order: "asc" },
            select: {
              id: true,
              title: true,
              description: true,
              hint: true,
              data: true,
              type: true,
            },
          },
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!challenge) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  const introHtml = generateHTML(challenge.introduction);

  // generate HTML for each section description
  let challengeSections = [];
  for (const section in challenge.challengeSections) {
    if (
      Object.prototype.hasOwnProperty.call(challenge.challengeSections, section)
    ) {
      challengeSections.push({
        ...challenge.challengeSections[section],
        descriptionHtml: generateHTML(
          challenge.challengeSections[section].description || "",
        ),
      });

      // generate HTML for each question description
      let questions = [];
      for (const question in challenge.challengeSections[section].questions) {
        if (
          Object.prototype.hasOwnProperty.call(
            challenge.challengeSections[section].questions,
            question,
          )
        ) {
          questions.push({
            ...challenge.challengeSections[section].questions[question],
            descriptionHtml: generateHTML(
              challenge.challengeSections[section].questions[question]
                .description || "",
            ),
          });
        }
      }
      challengeSections[section].questions = questions;
    }
  }

  return {
    ...challenge,
    challengeSections: challengeSections as (ChallengeSection & {
      descriptionHtml?: string;
      questions: (Question & { descriptionHtml?: string })[];
    })[],
    introductionHtml: introHtml,
  };
}

export async function addSectionToChallenge(
  challengeId: string,
  sectionId: string,
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
  sectionId: string,
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
  data: Prisma.ChallengeSectionCreateWithoutChallengeInput,
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

/* --------------------------- Question Functions --------------------------- */
export async function addQuestion(
  challengeSectionId: string,
  questionData: Prisma.QuestionCreateWithoutChallengeSectionInput,
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

export async function deleteQuestion({ id }: Pick<Question, "id">) {
  return prisma.question.delete({
    where: { id },
  });
}
