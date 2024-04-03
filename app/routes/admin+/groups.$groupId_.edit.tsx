import { invariantResponse } from '@epic-web/invariant'
import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { GeneralErrorBoundary } from '#app/components/error-boundary'
import { requireUserId } from '#app/utils/auth.server'
import { prisma } from '#app/utils/db.server'
import { GroupEditor } from './__group-editor'

export { action } from './__group-editor.server'

export async function loader({ params, request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request)
  const group = await prisma.group.findFirst({
    select: {
      id: true,
      name: true,
      description: true,
      users: { select: { id: true, name: true, username: true } },
    },
    where: {
      id: params.groupId,
      users: {some: { id: userId }}
    },
  })

  invariantResponse(group, 'Not found', { status: 404 })

  return json({ group })
}

export default function GroupEdit() {
  const data = useLoaderData<typeof loader>()

  return <GroupEditor group={data.group} />
}

export function ErrorBoundary() {
  return (
    <GeneralErrorBoundary
      statusHandlers={{
        404: ({ params }) => (
          <p>No group with the id "{params.groupId}" exists</p>
        ),
      }}
    />
  )
}
