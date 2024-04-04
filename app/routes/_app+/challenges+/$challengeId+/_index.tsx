import { Link, useRouteLoaderData } from '@remix-run/react'
import { useUser, userHasRole } from '#app/utils/user'
import { type loader as challengeLoader } from '../$challengeId'
import { SectionOverview } from './__section-overview'

export default function ChallengeIndex() {
	const data = useRouteLoaderData<typeof challengeLoader>(
		'routes/_app+/challenges+/$challengeId',
	)
	const user = useUser()
	const isAdmin = userHasRole(user, 'admin')
	return (
		<div className='h-full overflow-y-auto pb-12'>
			<p className="whitespace-break-spaces text-sm md:text-lg">
				{data?.challenge.description}
			</p>
			<h3>Sections</h3>
			<div className="flex flex-col gap-3 p-4">
				{data?.challenge.challengeSections.map(section => (
					<SectionOverview
						key={section.id}
						name={section.name}
						description={section.description ?? undefined}
						tasks={section.tasks}
						challengeId={data.challenge.id}
						sectionId={section.id}
						admin={isAdmin}
					/>
				))}
			</div>

			<h3>Users</h3>
			<ul>
				{data?.challenge.joinedUsers.map(user => (
					<li key={user.id}>
						<Link to={`/users/${user.username}`}>{user.name}</Link>
					</li>
				))}
			</ul>
		</div>
	)
}
