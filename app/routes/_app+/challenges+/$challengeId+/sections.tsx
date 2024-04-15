import { type SerializeFrom, type LoaderFunctionArgs } from '@remix-run/node'
import { Link, Outlet } from '@remix-run/react'
import { BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from '#app/components/ui/breadcrumb'
import { type BreadcrumbHandle } from '../../challenges'

export const handle: BreadcrumbHandle = {
	breadcrumb: (match: any, last?: boolean) => {
		const current = match.data as SerializeFrom<typeof loader>
		return (
			<BreadcrumbItem>
				{last ? (
					<BreadcrumbPage>Sections</BreadcrumbPage>
				): (
					<BreadcrumbLink asChild>
						<Link to={`/challenges/${current.challengeId}/sections`}>Sections</Link>
					</BreadcrumbLink>
				)}
			</BreadcrumbItem>
		)
	},
}

export function loader({ params }: LoaderFunctionArgs) {
	return {
		challengeId: params.challengeId,
	}
}

export default function ChallengeSections() {
	return (
		<div className="inset-0 flex h-full flex-col overflow-y-auto">
			<Outlet />
		</div>
	)
}
