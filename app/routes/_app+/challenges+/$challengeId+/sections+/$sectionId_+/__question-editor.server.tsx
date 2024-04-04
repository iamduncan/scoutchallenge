import { parseWithZod } from '@conform-to/zod'
import { redirect, type ActionFunctionArgs, json } from '@remix-run/node'
import { prisma } from '#app/utils/db.server'
import { QuestionSchema } from './__question-editor'

export async function action({ request, params }: ActionFunctionArgs) {
	const formData = await request.formData()

	const submission = await parseWithZod(formData, {
		schema: QuestionSchema,
		async: true,
	})

	if (submission.status !== 'success') {
		return json(
			{ result: submission.reply() },
			{ status: submission.status === 'error' ? 400 : 200 },
		)
	}

	const { id: questionId, title, description, hint, type } = submission.value

	await prisma.question.upsert({
		select: { id: true },
		where: { id: questionId ?? '__new_question__' },
		create: {
			title,
			description,
			hint,
			type,
			challengeSection: {
				connect: {
					id: params.sectionId,
				},
			},
			order: 0,
		},
		update: {
			title,
			description,
			hint,
			type,
		},
	})

	return redirect(
		`/challenges/${params.challengeId}/sections/${params.sectionId}`,
	)
}
