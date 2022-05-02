import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import type { User } from "~/models/user.server";
import { getUserById } from "~/models/user.server";

export const loader: LoaderFunction = async ({ params }) => {
  const userId = params.userId;
  if (!userId) {
    throw new Error("No userId provided");
  }
  const user = await getUserById(userId);
  return {
    user,
  };
};

export default function AdminUser() {
  const { user } = useLoaderData<{ user: User }>();
  return (
    <div className="flex h-full flex-col">
      <main className="h-full bg-white">
        <div className="h-full bg-gray-50 p-4">
          <div className="mb-6 block text-xl text-blue-500">
            {user.firstName} {user.lastName}
          </div>
          <pre>
            <code>{JSON.stringify(user, null, 2)}</code>
          </pre>
        </div>
      </main>
    </div>
  );
}
