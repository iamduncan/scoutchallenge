import { invariantResponse } from '@epic-web/invariant'
import { type LoaderFunctionArgs } from '@remix-run/node'
import { Outlet, json, useLoaderData } from '@remix-run/react'
import { prisma } from '#app/utils/db.server'

export async function loader({ params }: LoaderFunctionArgs) {
	const section = await prisma.challengeSection.findFirst({
		where: { id: params.sectionId, challengeId: params.challengeId },
		select: {
			id: true,
			name: true,
			description: true,
			order: true,
		},
	})

	invariantResponse(section, 'Challenge section not found', { status: 404 })

	return json({ section })
}

export default function ChallengeSection() {
	const data = useLoaderData<typeof loader>()
	return (
		<div className="inset-0 flex h-full flex-col overflow-y-auto">
			<h4>{data.section.name}</h4>
			<Outlet />
		</div>
	)
}
