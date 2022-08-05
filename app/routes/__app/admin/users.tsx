import { UserIcon } from "@heroicons/react/outline";
import type { Group } from "~/models/group.server";
import { Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import type { User } from "~/models/user.server";
import { listUsers } from "~/models/user.server";
import { requireAdmin } from "~/session.server";

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
    <div className="flex h-full flex-col">
      <main className="flex h-full bg-white">
        <div className="hidden h-full w-80 border-r bg-gray-50 md:block">
          <Link to="new" className="block p-4 text-xl text-blue-500">
            + New User
          </Link>

          <hr />

          <ol>
            {users.map((user) => (
              <li key={user.id}>
                <NavLink
                  className={({ isActive }) =>
                    `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                  }
                  to={`/admin/users/${user.id}`}
                >
                  <UserIcon className="mr-3 inline-block h-6 w-6" />{" "}
                  {user.firstName} {user.lastName}
                  <div>
                    <small>
                      {user.groups.length > 0 && user.groups[0]?.name}
                    </small>
                  </div>
                </NavLink>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
