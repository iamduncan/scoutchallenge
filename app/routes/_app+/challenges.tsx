import { getFormProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { invariantResponse } from '@epic-web/invariant'
import {
	type ActionFunctionArgs,
	json,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import {
	Link,
	NavLink,
	Outlet,
	useFetcher,
	useFetchers,
	useLoaderData,
	useMatches,
} from '@remix-run/react'
import { Fragment } from 'react'
import { z } from 'zod'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '#app/components/ui/breadcrumb'
import { Icon, type IconName } from '#app/components/ui/icon'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '#app/components/ui/tooltip'
import { prisma } from '#app/utils/db.server'
import { cn } from '#app/utils/misc'
import { requireUserWithRole } from '#app/utils/permissions.server'
import {
	getPreferences,
	setPreferences,
} from '#app/utils/preferences.server.js'

export const BreadcrumbHandle = z.object({
	breadcrumb: z
		.function()
		.args(z.object({ data: z.any() }), z.boolean().optional())
		.returns(z.custom<JSX.Element>()),
})
export type BreadcrumbHandle = z.infer<typeof BreadcrumbHandle>

export const handle: BreadcrumbHandle = {
	breadcrumb: (match: any, last?: boolean) => (
		<BreadcrumbItem>
			{last ? (
				<BreadcrumbPage>Challenges</BreadcrumbPage>
			) : (
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
			type: true,
			joinedUsers: { select: { id: true } },
		},
	})

	return json({
		challenges,
		sidebar: getPreferences(request)?.sidebar,
	})
}

const BreadcrumbHandleMatch = z.object({
	handle: BreadcrumbHandle,
	data: z.any(),
})

export default function Challenges() {
	const data = useLoaderData<typeof loader>()

	const matches = useMatches()
	const breadcrumbs = matches
		.map(m => {
			const result = BreadcrumbHandleMatch.safeParse(m)
			if (!result.success || !result.data.handle.breadcrumb) return null
			return result.data
		})
		.filter(Boolean)

	const iconName: Record<string, IconName> = {
		standard: 'bookmark-check',
		group: 'users',
	}

	const collapsed = useSidebar() === 'closed'
	const navLinkDefaultClassName = !collapsed
		? 'line-clamp-2 block rounded-l-full py-2 pl-8 pr-6 text-base lg:text-xl'
		: 'line-clamp-2 block rounded-l-full py-2 pl-4 pr-2 text-base lg:text-xl'

	return (
		<main className="container flex h-full min-h-[400px] px-0 pb-12 md:px-8">
			<div
				className={cn(
					'grid w-full grid-cols-4 bg-muted pl-2 transition-all duration-500 ease-in-out md:container md:rounded-3xl md:pr-0',
					collapsed ? 'md:grid-cols-24 md:pl-1' : 'md:grid-cols-4',
				)}
			>
				<div className="relative col-span-1">
					<div className="absolute inset-0 flex flex-col">
						<ul
							className={cn(
								'overflow-y-auto overflow-x-hidden',
								collapsed ? 'py-4' : 'py-12',
							)}
						>
							<li className="p-1 pr-0">
								<NavLink
									to="new"
									className={({ isActive }) =>
										cn(navLinkDefaultClassName, isActive && 'bg-accent')
									}
								>
									{collapsed ? (
										<TooltipProvider delayDuration={300}>
											<Tooltip>
												<TooltipTrigger>
													<Icon name="plus" />
												</TooltipTrigger>
												<TooltipContent>New Challenge</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									) : (
										<Icon name="plus">New Challenge</Icon>
									)}
								</NavLink>
							</li>
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
										{collapsed ? (
											<TooltipProvider delayDuration={300}>
												<Tooltip>
													<TooltipTrigger>
														<Icon
															name={
																iconName[
																	challenge.type as keyof typeof iconName
																]
															}
														/>
													</TooltipTrigger>
													<TooltipContent>
														{challenge.name}
														<br />
														{challenge.joinedUsers.length} participants
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
										) : (
											<Icon
												name={iconName[challenge.type as keyof typeof iconName]}
											>
												{challenge.name}
											</Icon>
										)}
									</NavLink>
								</li>
							))}
						</ul>
					</div>
					<SidebarSwitch sidebar={data.sidebar} />
				</div>
				<div
					className={cn(
						'relative bg-accent transition-all duration-500 ease-in-out md:rounded-r-3xl',
						collapsed ? 'col-[span_23_/_span_23]' : 'col-span-3',
					)}
				>
					<div className="absolute inset-0 flex flex-col px-10 py-6">
						<Breadcrumb>
							<BreadcrumbList>
								{breadcrumbs.map((data, index) => (
									<Fragment key={index}>
										{index !== 0 && <BreadcrumbSeparator />}
										{data.handle.breadcrumb(
											data,
											index === breadcrumbs.length - 1,
										)}
									</Fragment>
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

const SidebarSchema = z.object({
	collapsed: z.enum(['open', 'closed']),
})

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData()
	const submission = parseWithZod(formData, {
		schema: SidebarSchema,
	})

	invariantResponse(submission.status === 'success', 'Invalid form submission')

	const { collapsed } = submission.value

	const responseInit = {
		headers: {
			'Set-Cookie': setPreferences({ sidebar: collapsed }),
		},
	}
	return json({ result: submission.reply() }, responseInit)
}

export function useSidebar() {
	const data = useLoaderData<typeof loader>()
	const userPrefes = data.sidebar
	const optimisticSidebar = useOptimisticSidebarSwitch()
	if (optimisticSidebar) {
		return optimisticSidebar
	}
	return userPrefes ?? 'open'
}

export function useOptimisticSidebarSwitch() {
	const fetchers = useFetchers()
	const sidebarFetcher = fetchers.find(f => f.formAction === '/challenges')

	if (sidebarFetcher && sidebarFetcher.formData) {
		const submission = parseWithZod(sidebarFetcher.formData, {
			schema: SidebarSchema,
		})

		if (submission.status === 'success') {
			return submission.value.collapsed
		}
	}
}

function SidebarSwitch({ sidebar }: { sidebar?: 'open' | 'closed' }) {
	const fetcher = useFetcher<typeof action>()

	const [form] = useForm({
		id: 'sidebar-switch',
		lastResult: fetcher.data?.result,
	})

	const optimisticMode = useOptimisticSidebarSwitch()
	const mode = optimisticMode ?? sidebar ?? 'open'
	const nextSidebar = mode === 'open' ? 'closed' : 'open'

	return (
		<fetcher.Form method="POST" {...getFormProps(form)}>
			<input type="hidden" name="collapsed" value={nextSidebar} />
			<button
				type="submit"
				className={cn(
					'absolute transition-all duration-100 ease-in-out',
					sidebar === 'open' ? 'bottom-6 right-6' : 'bottom-3 right-3',
				)}
			>
				<Icon name={sidebar === 'closed' ? 'pin-right' : 'pin-left'} />
			</button>
		</fetcher.Form>
	)
}
