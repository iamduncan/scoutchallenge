import  { type Group } from "@prisma/client";
import { prisma } from "#app/utils/db.server.ts";

export type { Group } from "@prisma/client";

export function getGroup({ id }: Pick<Group, "id">) {
  return prisma.group.findFirst({
    where: { id },
  });
}

export function getGroupListItems() {
  return prisma.group.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}
