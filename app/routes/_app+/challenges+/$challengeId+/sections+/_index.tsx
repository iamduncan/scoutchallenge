import { type LoaderFunctionArgs } from '@remix-run/node'
import { NavLink, json, useLoaderData } from '@remix-run/react'
import { Icon } from '#app/components/ui/icon'
import { prisma } from '#app/utils/db.server'
import { cn } from '#app/utils/misc'

export async function loader({ request, params }: LoaderFunctionArgs) {
	const sections = await prisma.challengeSection.findMany({
		where: { challengeId: params.challengeId },
		orderBy: { order: 'asc' },
		select: {
			id: true,
			name: true,
		},
	})

	return json({ sections })
}

export default function ChallengeSections() {
	const data = useLoaderData<typeof loader>()
	const navLinkDefaultClassName =
		'line-clamp-2 block rounded-l-full py-2 pl-8 pr-6 text-base lg:text-xl'
	return (
		<div className="inset-0 flex flex-col py-4">
			{data.sections.map(section => (
				<NavLink
					key={section.id}
					to={section.id}
					className={({ isActive }) =>
						cn(navLinkDefaultClassName, isActive && 'bg-accent')
					}
				>
					{section.name}
				</NavLink>
			))}

			<NavLink
				to="new"
				className={({ isActive }) =>
					cn(navLinkDefaultClassName, isActive && 'bg-accent')
				}
			>
				<Icon name="plus">New Challenge Section</Icon>
			</NavLink>
		</div>
	)
}
