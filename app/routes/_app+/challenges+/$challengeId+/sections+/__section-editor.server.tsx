import { parseWithZod } from '@conform-to/zod'
import { json, type ActionFunctionArgs, redirect } from '@remix-run/node'
import { z } from 'zod'
import { prisma } from '#app/utils/db.server'
import { ChallengeSectionSchema } from './__section-editor'

export async function action({ request, params }: ActionFunctionArgs) {
	const formData = await request.formData()

	const submission = await parseWithZod(formData, {
		schema: ChallengeSectionSchema.superRefine(async (data, ctx) => {
			if (!data.id) return

			const challengeSection = await prisma.challengeSection.findUnique({
				select: { id: true },
				where: { id: data.id },
			})
			if (!challengeSection) {
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
			{ status: submission.status === 'error' ? 400 : 200 },
		)
	}

	const { id: sectionId, name, description, order } = submission.value

	const updatedChallengeSection = await prisma.challengeSection.upsert({
		select: { id: true },
		where: { id: sectionId ?? '__new_section__' },
		create: {
			name,
			description,
			order,
			challenge: {
				connect: {
					id: params.challengeId,
				},
			},
		},
		update: {
			name,
			description,
			order,
		},
	})

	return redirect(
		`/challenges/${params.challengeId}/sections/${updatedChallengeSection.id}`,
	)
}
