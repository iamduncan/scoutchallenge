import { type SerializeFrom, type LoaderFunctionArgs } from '@remix-run/node'
import { Link, Outlet } from '@remix-run/react'
import { BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from '#app/components/ui/breadcrumb'
import { type BreadcrumbHandle } from '../../../../challenges'

export const handle: BreadcrumbHandle = {
	breadcrumb: (match: any, last?: boolean) => {
		const current = match.data as SerializeFrom<typeof loader>
		return (
			<BreadcrumbItem>
				{last ? (
					<BreadcrumbPage>Tasks</BreadcrumbPage>
				): (
					<BreadcrumbLink asChild>
						<Link to={`/challenges/${current.challengeId}/sections/${current.sectionId}/tasks`}>Tasks</Link>
					</BreadcrumbLink>
				)}
			</BreadcrumbItem>
		)
	},
}

export function loader({ params }: LoaderFunctionArgs) {
	return {
		challengeId: params.challengeId,
    sectionId: params.sectionId,
	}
}

export default function Tasks() {
	return <Outlet />
}
