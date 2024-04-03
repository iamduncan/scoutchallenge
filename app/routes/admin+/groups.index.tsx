import { useRouteLoaderData } from '@remix-run/react'
import { type loader as groupsLoader } from './groups'

export default function GroupsIndex() {
  const data = useRouteLoaderData<typeof groupsLoader>('routes/admin+/groups')

  return (
    <div>
      <h1>Groups</h1>
      <ul>
        {data?.groups.map(group => (
          <li key={group.id}>
            <h2>{group.name}</h2>
            <p>{group.users.length} users</p>
          </li>
        ))}
      </ul>
    </div>
  )
}