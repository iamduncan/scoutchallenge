import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { type LoaderFunctionArgs, json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { getUserById } from '#app/models/user.server.ts';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const userId = params.userId;
  if (!userId) {
    throw new Error('No userId provided');
  }
  const user = await getUserById(userId);
  if (!user) {
    throw new Error('No user found');
  }
  return json({
    user,
  });
};

export default function AdminUser() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <div className="flex h-full flex-col">
      <div className="h-full bg-muted rounded-lg p-4">
        <div className="mb-6 block text-xl text-blue-500">{user.name}</div>
        {user.groups.length > 0 && (
          <div className="mb-6">
            <div className="mb-2">
              <h3>Group{user.groups.length > 1 && 's'}</h3>
              {user.groups.map((group) => (
                <div key={group.id}>{group.name}</div>
              ))}
            </div>
          </div>
        )}
        {user.sections.length > 0 && (
          <div className="mb-6">
            <div className="mb-2">
              <h3>Section{user.sections.length > 1 && 's'}</h3>
              {user.sections.map((section) => (
                <div key={section.id}>{section.name}</div>
              ))}
            </div>
          </div>
        )}
        <pre>
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
      <Link
        to=".."
        className="mb-1 mr-1 flex items-center gap-2 px-3 py-1 text-xs font-bold uppercase text-blue-500 md:hidden"
        type="button"
      >
        <ArrowLeftIcon className="h-6 w-6" /> Back
      </Link>
    </div>
  );
}
