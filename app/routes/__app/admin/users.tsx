import { UserIcon } from "@heroicons/react/outline";
import type { Group } from "~/models/group.server";
import { Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import type { User } from "~/models/user.server";
import { listUsers } from "~/models/user.server";
import { requireAdmin } from "~/session.server";
import { AdminList } from "~/components/ui";

export const loader: LoaderFunction = async ({ request }) => {
  requireAdmin(request);
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
        name: `${user.firstName} ${user.lastName}`,
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
