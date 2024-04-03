import { parseWithZod } from "@conform-to/zod";
import { json, type ActionFunctionArgs, redirect } from "@remix-run/node";
import { z } from "zod";
import { requireUserId } from "#app/utils/auth.server";
import { prisma } from "#app/utils/db.server";
import { GroupSchema } from "./__group-editor";

export async function action({ request }: ActionFunctionArgs) {
  const userId = await requireUserId(request)

  const formData = await request.formData()

  const submission = await parseWithZod(formData, {
    schema: GroupSchema.superRefine(async (data, ctx) => {
      if (!data.id) return

      const group = await prisma.group.findUnique({
        select: { id: true },
        where: { id: data.id },
      })
      if (!group) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Group not found',
        })
      }
    }),
    async: true,
  })

  if (submission.status !== 'success') {
    return json(
      { result: submission.reply() },
      { status: submission.status === 'error' ? 400 : 200 }
    )
  }

  const {
    id: groupId,
    name,
    description,
  } = submission.value

  const updatedGroup = await prisma.group.upsert({
    select: { id: true },
    where: { id: groupId ?? '__new_group__' },
    create: {
      name,
      description,
      // WIP: this should be optional
      users: {
        connect: { id: userId },
      }
    },
    update: {
      name,
      description,
    },
  })

  return redirect(`/admin/groups/${updatedGroup.id}`)
}