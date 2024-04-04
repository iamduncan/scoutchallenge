import { invariantResponse } from '@epic-web/invariant'
import { type LoaderFunctionArgs } from '@remix-run/node'
import { Link, Outlet, json, useLoaderData } from '@remix-run/react'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from '#app/components/ui/breadcrumb'
import { prisma } from '#app/utils/db.server'

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
					questions: {
						select: {
							id: true,
							order: true,
							title: true,
							type: true,
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
		<div className="absolute inset-0 flex flex-col px-10">
			<h2 className="mb-2 pt-12 text-h2 lg:mb-6">{data.challenge.name}</h2>
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink asChild>
							<Link to="/challenges/">Challenges</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink asChild>
							<Link to={`/challenges/${data.challenge.id}/`}>
								{data.challenge.name}
							</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink asChild>
							<Link to={`/challenges/${data.challenge.id}/sections/`}>
								Sections
							</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<Outlet />
		</div>
	)
}
