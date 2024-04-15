import { invariantResponse } from '@epic-web/invariant'
import { type LoaderFunctionArgs } from '@remix-run/node'
import { Link, Outlet, json, useLoaderData } from '@remix-run/react'
import { BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from '#app/components/ui/breadcrumb'
import { prisma } from '#app/utils/db.server'
import { type BreadcrumbHandle } from '../challenges'

export const handle: BreadcrumbHandle = {
	breadcrumb: (match: any, last?: boolean) => {
		const current = match.data
		return (
			<BreadcrumbItem>
				{last ? (
					<BreadcrumbPage>{current.challenge.name}</BreadcrumbPage>
				) : (
					<BreadcrumbLink asChild>
						<Link to={`/challenges/${current.challenge.id}`}>{current.challenge.name}</Link>
					</BreadcrumbLink>
				)}
			</BreadcrumbItem>
		)
	}
}

export async function loader({ params }: LoaderFunctionArgs) {
	const { challengeId } = params
	const challenge = await prisma.challenge.findUnique({
		where: { id: challengeId },
		select: {
			id: true,
			name: true,
			description: true,
			joinedUsers: { select: { id: true, username: true, name: true } },
			challengeSections: {
				select: {
					id: true,
					name: true,
					description: true,
					order: true,
					tasks: {
						select: {
							id: true,
							order: true,
							title: true,
							type: true,
							points: true,
							data: true,
						},
					},
				},
			},
		},
	})

	invariantResponse(challenge, 'Not found', { status: 404 })

	return json({ challenge })
}

export default function Challenge() {
	const data = useLoaderData<typeof loader>()

	return (
		<>
			<h2 className="mb-2 pt-4 text-h2 lg:mb-6">{data.challenge.name}</h2>
			<Outlet />
		</>
	)
}
