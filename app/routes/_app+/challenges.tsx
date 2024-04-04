import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { Link, NavLink, Outlet, useLoaderData, useMatches } from '@remix-run/react'
import { z } from 'zod'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '#app/components/ui/breadcrumb'
import { Icon } from '#app/components/ui/icon'
import { prisma } from '#app/utils/db.server'
import { cn } from '#app/utils/misc'
import { requireUserWithRole } from '#app/utils/permissions.server'

export const BreadcrumbHandle = z.object({
	breadcrumb: z.function()
		.args(z.object({ data: z.any() }), z.boolean().optional())
		.returns(z.custom<JSX.Element>())
})
export type BreadcrumbHandle = z.infer<typeof BreadcrumbHandle>

export const handle: BreadcrumbHandle = {
	breadcrumb: (match: any, last?: boolean) => (
		<BreadcrumbItem>
			{last ? (
				<BreadcrumbPage>Challenges</BreadcrumbPage>
			):(
				<BreadcrumbLink asChild>
					<Link to="/challenges/">Challenges</Link>
				</BreadcrumbLink>
			)}
		</BreadcrumbItem>
	),
}

export async function loader({ request }: LoaderFunctionArgs) {
	await requireUserWithRole(request, 'admin')

	const challenges = await prisma.challenge.findMany({
		select: {
			id: true,
			name: true,
			joinedUsers: { select: { id: true } },
		},
	})

	return json({ challenges })
}

const BreadcrumbHandleMatch = z.object({
	handle: BreadcrumbHandle,
	data: z.any(),
})

export default function Challenges() {
	const data = useLoaderData<typeof loader>()
	const navLinkDefaultClassName =
		'line-clamp-2 block rounded-l-full py-2 pl-8 pr-6 text-base lg:text-xl'

		const matches = useMatches()
		const breadcrumbs = matches.map(m => {
			const result = BreadcrumbHandleMatch.safeParse(m)
			if (!result.success || !result.data.handle.breadcrumb) return null
			return result.data
		})
		.filter(Boolean)
	
	return (
		<main className="container flex h-full min-h-[400px] px-0 pb-12 md:px-8">
			<div className="grid w-full grid-cols-4 bg-muted pl-2 md:container md:rounded-3xl md:pr-0">
				<div className="relative col-span-1">
					<div className="absolute inset-0 flex flex-col">
						<ul className="overflow-y-auto overflow-x-hidden py-12">
							<NavLink
								to="new"
								className={({ isActive }) =>
									cn(navLinkDefaultClassName, isActive && 'bg-accent')
								}
							>
								<Icon name="plus">New Challenge</Icon>
							</NavLink>
							{data.challenges.map(challenge => (
								<li key={challenge.id} className="p-1 pr-0">
									<NavLink
										to={challenge.id}
										preventScrollReset
										prefetch="intent"
										className={({ isActive }) =>
											cn(navLinkDefaultClassName, isActive && 'bg-accent')
										}
									>
										{challenge.name}
									</NavLink>
								</li>
							))}
						</ul>
					</div>
				</div>
				<div className="relative col-span-3 bg-accent md:rounded-r-3xl">
					<div className="absolute inset-0 flex flex-col px-10 py-6">
						<Breadcrumb>
							<BreadcrumbList>
							{breadcrumbs.map((data, index) => (
									<>
										{index !== 0 && (
											<BreadcrumbSeparator />
										)}
										{data.handle.breadcrumb(data, index === breadcrumbs.length - 1)}
									</>
							))}
							</BreadcrumbList>
						</Breadcrumb>
						<Outlet />
					</div>
				</div>
			</div>
		</main>
	)
}
