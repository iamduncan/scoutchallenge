import { type LoaderFunctionArgs, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { prisma } from '#app/utils/db.server.ts';
import { requireUserWithRole } from '#app/utils/permissions.ts';

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserWithRole(request, 'admin');
  const roles = await prisma.role.findMany({
    select: {
      id: true,
      name: true,
      permissions: {
        select: {
          id: true,
          access: true,
          entity: true,
          action: true,
        },
      },
      users: {
        select: {
          id: true,
          name: true,
          username: true,
        },
      }
    }
  });

  return json(roles);
}

export default function () {
  const roles = useLoaderData<typeof loader>();
  return (
    <div className="h-full bg-muted p-4 rounded-lg w-full">
      <div className="mb-6 block text-xl text-blue-500">Roles</div>
      {roles.map((role) => (
        <div key={role.id} className="mb-2 md:flex border-b border-b-slate-800 last:border-b-none">
          <div className="w-full md:w-1/2">
            <h3>{role.name}</h3>
            {role.permissions.map((permission) => (
              <div key={permission.id}>
                <strong>{permission.entity}</strong> {permission.action} {permission.access}
              </div>
            ))}
          </div>
          <div className="w-full md:w-1/2">
            <h3>Users with this role</h3>
            {role.users.map((user) => (
              <div key={user.id}>
                {user.name} ({user.username})
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}