import { parseWithZod } from '@conform-to/zod'
import { redirect, type ActionFunctionArgs, json } from '@remix-run/node'
import { prisma } from '#app/utils/db.server'
import { TaskSchema } from './__task-editor'

export async function action({ request, params }: ActionFunctionArgs) {
	const formData = await request.formData()

	const submission = await parseWithZod(formData, {
		schema: TaskSchema,
		async: true,
	})

	if (submission.status !== 'success') {
		return json(
			{ result: submission.reply() },
			{ status: submission.status === 'error' ? 400 : 200 },
		)
	}

	const { id: questionId, title, description, hint, type, points, data } = submission.value

	await prisma.task.upsert({
		select: { id: true },
		where: { id: questionId ?? '__new_question__' },
		create: {
			title,
			description,
			hint,
			type,
			points,
			data,
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
			points,
			data,
		},
	})

	return redirect(
		`/challenges/${params.challengeId}/sections/${params.sectionId}`,
	)
}
