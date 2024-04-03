import { invariantResponse } from "@epic-web/invariant"
import { type LoaderFunctionArgs } from "@remix-run/node"
import { Link, json, useLoaderData } from "@remix-run/react"
import { prisma } from "#app/utils/db.server"

export async function loader({ params }: LoaderFunctionArgs) {
  const { challengeId } = params
  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId },
    select: {
      id: true,
      name: true,
      description: true,
      joinedUsers: { select: { id: true, username: true, name: true } },
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
			<div className={`pb-12 overflow-y-auto`}>
        <p className="whitespace-break-spaces text-sm md:text-lg">
					{data.challenge.description}
				</p>
			</div>
      <h3>Users</h3>
      <ul>
        {data.challenge.joinedUsers.map(user => (
          <li key={user.id}>
            <Link to={`/users/${user.username}`}>{user.name}</Link>
          </li>
        ))}
      </ul>
		</div>

  )
}
