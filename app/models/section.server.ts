import type { User, Section } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Section } from "@prisma/client";

export function getSection({ id }: Pick<Section, "id">) {
  return prisma.section.findFirst({
    where: { id },
  });
}

export function getSectionListItems({ userId }: { userId: User["id"] }) {
  return prisma.section.findMany({
    where: { users: { some: { id: userId } } },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}
