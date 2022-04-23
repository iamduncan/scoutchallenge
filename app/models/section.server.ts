import type { User, Section } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Section } from "@prisma/client";

export function getSection({ id }: Pick<Section, "id">) {
  return prisma.section.findFirst({
    where: { id },
    include: {
      users: true,
    },
  });
}

export function getSectionListItems({ userId }: { userId: User["id"] }) {
  return prisma.section.findMany({
    where: { users: { some: { id: userId } } },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}

export function createSection({
  name,
  group,
  userId,
}: Pick<Section, "name"> & { userId: User["id"]; group?: string }) {
  return prisma.section.create({
    data: {
      name,
      group: { connect: { id: group } },
      users: {
        connect: {
          id: userId,
        },
      },
    },
  });
}
