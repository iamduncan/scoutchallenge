import { parseWithZod } from "@conform-to/zod";
import { json, type ActionFunctionArgs, redirect } from "@remix-run/node";
import { z } from "zod";
import { requireUserId } from "#app/utils/auth.server";
import { prisma } from "#app/utils/db.server";
import { ChallengeSchema } from "./__challenge-editor";

export async function action({ request }: ActionFunctionArgs) {
  const userId = await requireUserId(request)

  const formData = await request.formData()

  const submission = await parseWithZod(formData, {
    schema: ChallengeSchema.superRefine(async (data, ctx) => {
      if (!data.id) return

      const challenge = await prisma.group.findUnique({
        select: { id: true },
        where: { id: data.id },
      })
      if (!challenge) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Challenge not found',
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
    type,
    status,
  } = submission.value

  const updatedChallenge = await prisma.challenge.upsert({
    select: { id: true },
    where: { id: groupId ?? '__new_challenge__' },
    create: {
      name,
      description,
      status,
      type,
      createdBy: { connect: { id: userId } },
    },
    update: {
      name,
      description,
    },
  })

  return redirect(`/challenges/${updatedChallenge.id}`)
}