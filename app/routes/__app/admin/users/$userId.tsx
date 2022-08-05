import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { getUserById } from "~/models/user.server";

export const loader = async ({ params }: LoaderArgs) => {
  const userId = params.userId;
  if (!userId) {
    throw new Error("No userId provided");
  }
  const user = await getUserById(userId);
  if (!user) {
    throw new Error("No user found");
  }
  return json({
    user,
  });
};

export default function AdminUser() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <div className="flex h-full flex-col">
      <main className="h-full bg-white">
        <div className="h-full bg-gray-50 p-4">
          <div className="mb-6 block text-xl text-blue-500">
            {user.firstName} {user.lastName}
          </div>
          {user.groups.length > 0 && (
            <div className="mb-6">
              <div className="mb-2">
                <h3>Group{user.groups.length > 1 && "s"}</h3>
                {user.groups.map((group) => (
                  <div key={group.id}>{group.name}</div>
                ))}
              </div>
            </div>
          )}
          {user.sections.length > 0 && (
            <div className="mb-6">
              <div className="mb-2">
                <h3>Section{user.sections.length > 1 && "s"}</h3>
                {user.sections.map((section) => (
                  <div key={section.id}>{section.name}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
