import {
  RectangleGroupIcon,
  PuzzlePieceIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Form, useLoaderData, useSearchParams } from "@remix-run/react";
import { json, redirect, type ActionFunction, type LoaderFunctionArgs } from "@remix-run/server-runtime";
import avatarPlaceholder from "#app/assets/images/avatar-placeholder.gif";
import { AppLayout } from "#app/layouts/index.ts";
import { getUserById, updateUser } from "#app/models/user.server.ts";
import { getUserId, requireUserId } from "#app/utils/auth.server.ts";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const adminSecretQuery = url.searchParams.get("adminSecret");
  const adminSecret =
    process.env.ADMIN_SECRET !== undefined &&
    adminSecretQuery === process.env.ADMIN_SECRET;
  const userId = await requireUserId(request);
  const user = await getUserById(userId);
  if (!user) {
    throw redirect("/login");
  }
  return json({ adminSecret, user });
};

export const action: ActionFunction = async ({ request }) => {
  const url = new URL(request.url);
  const adminSecretQuery = url.searchParams.get("adminSecret");
  const adminSecret =
    process.env.ADMIN_SECRET !== undefined &&
    adminSecretQuery === process.env.ADMIN_SECRET;
  if (!adminSecret) {
    return json(
      {
        status: "error",
        message: "You are not authorized to view this page.",
      },
      403
    );
  }
  const formData = await request.formData();
  const role = formData.get("role") as string;
  const userId = await getUserId(request);
  if (!userId) {
    return json({ status: "error", message: "No user id" }, 400);
  }
  await updateUser(userId, {
    roles: {
      connectOrCreate: {
        where: { name: role },
        create: { name: role },
      },
    }
  });
  return json({ status: "success" });
};

export default function ProfilePage() {
  const { adminSecret, user } = useLoaderData<typeof loader>();
  const [ searchParams ] = useSearchParams();

  return (
    <AppLayout>
      <div className="no-wrap md:-mx-2 md:flex ">
        <div className="w-full md:mx-2 md:w-3/12">
          <div className="bg-white p-3">
            <div className="image overflow-hidden">
              <img
                className="mx-auto h-auto w-full"
                src={avatarPlaceholder}
                alt=""
              />
            </div>
            <h1 className="my-1 text-xl font-bold leading-8 text-gray-900">
              {user.name}
            </h1>
            {/* <h3 className="font-lg text-semibold leading-6 text-gray-600">
              Owner at Her Company Inc.
            </h3>
            <p className="text-sm leading-6 text-gray-500 hover:text-gray-600">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Reprehenderit, eligendi dolorum sequi illum qui unde aspernatur
              non deserunt
            </p> */}
            <ul className="mt-3 divide-y rounded bg-gray-100 py-2 px-3 text-gray-600 shadow-sm hover:text-gray-700 hover:shadow">
              <li className="flex items-center py-3">
                <span>Status</span>
                <span className="ml-auto">
                  <span className="rounded bg-green-500 py-1 px-2 text-sm text-white">
                    Active
                  </span>
                </span>
              </li>
              <li className="flex items-center py-3">
                <span>Member since</span>
                <span className="ml-auto">
                  {new Intl.DateTimeFormat("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }).format(new Date(user.createdAt))}
                </span>
              </li>
            </ul>
            {adminSecret && searchParams.get("adminSecret") && (
              <div className="mt-3">
                <Form
                  // eslint-disable-next-line remix-react-routes/require-valid-paths
                  action={`/profile?adminSecret=${searchParams.get(
                    "adminSecret"
                  )}`}
                  method="post"
                  className="flex flex-col"
                >
                  <div className="flex flex-col">
                    <label
                      htmlFor="role"
                      className="block text-sm font-medium leading-5 text-gray-700"
                    >
                      Role
                    </label>
                    {/* TODO: re-implement role picker */}
                  </div>
                  <div className="mt-3 flex flex-col">
                    <button
                      type="submit"
                      className="focus:shadow-outline-purple flex w-full justify-center rounded-md border border-transparent bg-purple-600 py-2 px-4 text-sm font-medium text-white transition duration-150 ease-in-out hover:bg-purple-500 focus:border-purple-700 focus:outline-none active:bg-purple-700"
                    >
                      Update
                    </button>
                  </div>
                </Form>
              </div>
            )}
          </div>
        </div>
        <div className="mx-2 h-64 w-full md:w-9/12">
          <div className="rounded-sm bg-white p-3 shadow-sm">
            <div className="flex items-center space-x-2 font-semibold leading-8 text-gray-900">
              <span className="text-purple-600">
                <UserIcon className="h-5" />
              </span>
              <span className="tracking-wide">About</span>
            </div>
            <div className="text-gray-700">
              <div className="grid text-sm md:grid-cols-2">
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2 font-semibold">First Name</div>
                  <div className="px-4 py-2">{user.name}</div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2 font-semibold">Email.</div>
                  <div className="px-4 py-2">
                    {/* eslint-disable-next-line remix-react-routes/use-link-for-routes */}
                    <a className="text-blue-800" href={`mailto:${user.email}`}>
                      {user.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 font-semibold leading-8 text-gray-900">
              <span className="text-purple-600">
                <RectangleGroupIcon className="h-5" />
              </span>
              <span className="tracking-wide">Groups</span>
            </div>
            <div>
              {user.groups.map((group) => (
                <div key={group.id}>{group.name}</div>
              ))}
            </div>

            <div className="flex items-center space-x-2 font-semibold leading-8 text-gray-900">
              <span className="text-purple-600">
                <UserGroupIcon className="h-5" />
              </span>
              <span className="tracking-wide">Sections</span>
            </div>
            <div>
              {user.groups.map((group) => (
                <div key={group.id}>{group.name}</div>
              ))}
            </div>

            {/* <button className="focus:shadow-outline hover:shadow-xs my-4 block w-full rounded-lg p-3 text-sm font-semibold text-blue-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none">
              Show Full Information
            </button> */}
          </div>

          <div className="my-4"></div>

          <div className="rounded-sm bg-white p-3 shadow-sm">
            <div className="grid grid-cols-2">
              <div>
                <div className="mb-3 flex items-center space-x-2 font-semibold leading-8 text-gray-900">
                  <span className="text-purple-600">
                    <PuzzlePieceIcon className="h-5" />
                  </span>
                  <span className="tracking-wide">Challenges</span>
                </div>
                <ul className="list-inside space-y-2">
                  <li>
                    <div>
                      You don't have any challenges available at the moment.
                    </div>
                  </li>
                  {/* <li>
                    <div className="text-indigo-600">
                      Owner at Her Company Inc.
                    </div>
                    <div className="text-xs text-gray-500">
                      March 2020 - Now
                    </div>
                  </li>
                  <li>
                    <div className="text-indigo-600">
                      Owner at Her Company Inc.
                    </div>
                    <div className="text-xs text-gray-500">
                      March 2020 - Now
                    </div>
                  </li>
                  <li>
                    <div className="text-indigo-600">
                      Owner at Her Company Inc.
                    </div>
                    <div className="text-xs text-gray-500">
                      March 2020 - Now
                    </div>
                  </li>
                  <li>
                    <div className="text-indigo-600">
                      Owner at Her Company Inc.
                    </div>
                    <div className="text-xs text-gray-500">
                      March 2020 - Now
                    </div>
                  </li> */}
                </ul>
              </div>
              {/* <div>
                <div className="mb-3 flex items-center space-x-2 font-semibold leading-8 text-gray-900">
                  <span className="text-purple-600">
                    <svg
                      className="h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path fill="#fff" d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path
                        fill="#fff"
                        d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                      />
                    </svg>
                  </span>
                  <span className="tracking-wide">Education</span>
                </div>
                <ul className="list-inside space-y-2">
                  <li>
                    <div className="text-indigo-600">
                      Masters Degree in Oxford
                    </div>
                    <div className="text-xs text-gray-500">
                      March 2020 - Now
                    </div>
                  </li>
                  <li>
                    <div className="text-indigo-600">
                      Bachelors Degreen in LPU
                    </div>
                    <div className="text-xs text-gray-500">
                      March 2020 - Now
                    </div>
                  </li>
                </ul>
              </div> */}
            </div>
          </div>

          <div className="rounded-sm bg-white p-3 shadow-sm">
            {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
