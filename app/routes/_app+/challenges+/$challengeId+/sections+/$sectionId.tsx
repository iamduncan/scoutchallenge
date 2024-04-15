import { invariantResponse } from '@epic-web/invariant'
import { type SerializeFrom, type LoaderFunctionArgs } from '@remix-run/node'
import { Link, Outlet, json, useLoaderData } from '@remix-run/react'
import {
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbPage,
} from '#app/components/ui/breadcrumb'
import { type BreadcrumbHandle } from '#app/routes/_app+/challenges'
import { prisma } from '#app/utils/db.server'

export const handle: BreadcrumbHandle = {
	breadcrumb: (match: any, last?: boolean) => {
		const current = match.data as SerializeFrom<typeof loader>
		return (
			<BreadcrumbItem>
				{last ? (
					<BreadcrumbPage>{current.section.name}</BreadcrumbPage>
				) : (
					<BreadcrumbLink asChild>
						<Link
							to={`/challenges/${current.challengeId}/sections/${current.section.id}`}
						>
							{current.section.name}
						</Link>
					</BreadcrumbLink>
				)}
			</BreadcrumbItem>
		)
	},
}

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

	return json({ section, challengeId: params.challengeId })
}

export default function ChallengeSection() {
	const data = useLoaderData<typeof loader>()
	return (
		<div className="inset-0 flex h-full flex-col overflow-y-auto px-2">
			<h4 className="text-h4">{data.section.name}</h4>
			<Outlet />
		</div>
	)
}
