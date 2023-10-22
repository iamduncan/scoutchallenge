import { type LoaderFunction } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { AdminList } from '#app/components/ui/index.ts';
import { type Group } from '#app/models/group.server.ts';
import { type User, listUsers } from '#app/models/user.server.ts';
import { requireUserWithRole } from '#app/utils/permissions.ts';

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserWithRole(request, 'ADMIN');
  const users = await listUsers();
  return {
    users,
  };
};

export default function AdminUsers() {
  const { users } = useLoaderData<{ users: (User & { groups: Group[] })[] }>();
  return (
    <AdminList
      title="User"
      route="users"
      listItems={users.map((user) => ({
        name: user.name ?? user.username,
        subName: user.groups.length > 0 ? user.groups[0]?.name : undefined,
        id: user.id,
      }))}
      hideDelete
    >
      <AdminList.Content>
        <Outlet />
      </AdminList.Content>
    </AdminList>
  );
}
