import { RoleType } from "@prisma/client";
import { Form, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { useUser } from "~/utils";

import avatarPlaceholder from "~/assets/images/avatar-placeholder.gif";
import {
  CollectionIcon,
  PuzzleIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/outline";
import { AppLayout } from "~/layouts";

type LoaderData = {
  adminSecret: boolean;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const adminSecretQuery = url.searchParams.get("adminSecret");
  const adminSecret =
    process.env.ADMIN_SECRET !== undefined &&
    adminSecretQuery === process.env.ADMIN_SECRET;
  return json<LoaderData>({ adminSecret });
};

export default function ProfilePage() {
  const user = useUser();
  const { adminSecret } = useLoaderData<LoaderData>();
  const roleOptions = [];
  for (const role in RoleType) {
    if (Object.prototype.hasOwnProperty.call(RoleType, role)) {
      const element = role;
      roleOptions.push(
        <option key={role} value={element}>
          {element}
        </option>
      );
    }
  }

  return (
    <AppLayout>
      <div className="no-wrap md:-mx-2 md:flex ">
        <div className="w-full md:mx-2 md:w-3/12">
          <div className="border-t-4 border-purple-400 bg-white p-3">
            <div className="image overflow-hidden">
              <img
                className="mx-auto h-auto w-full"
                src={avatarPlaceholder}
                alt=""
              />
            </div>
            <h1 className="my-1 text-xl font-bold leading-8 text-gray-900">
              {user.firstName} {user.lastName}
            </h1>
            <h3 className="font-lg text-semibold leading-6 text-gray-600">
              Owner at Her Company Inc.
            </h3>
            <p className="text-sm leading-6 text-gray-500 hover:text-gray-600">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Reprehenderit, eligendi dolorum sequi illum qui unde aspernatur
              non deserunt
            </p>
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
            {adminSecret && (
              <div className="mt-3">
                <Form
                  action="/profile/update"
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
                    <select
                      id="role"
                      name="role"
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                      defaultValue={user.role}
                    >
                      <option value="">Select a role</option>
                      {roleOptions}
                    </select>
                  </div>
                  <div className="mt-3 flex flex-col">
                    <button
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-500 focus:outline-none focus:border-purple-700 focus:shadow-outline-purple active:bg-purple-700 transition duration-150 ease-in-out"
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
              <span className="text-green-500">
                <UserIcon className="h-5" />
              </span>
              <span className="tracking-wide">About</span>
            </div>
            <div className="text-gray-700">
              <div className="grid text-sm md:grid-cols-2">
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2 font-semibold">First Name</div>
                  <div className="px-4 py-2">{user.firstName}</div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2 font-semibold">Last Name</div>
                  <div className="px-4 py-2">{user.lastName}</div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2 font-semibold">Email.</div>
                  <div className="px-4 py-2">
                    <a className="text-blue-800" href={`mailto:${user.email}`}>
                      {user.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 font-semibold leading-8 text-gray-900">
              <span className="text-green-500">
                <CollectionIcon className="h-5" />
              </span>
              <span className="tracking-wide">Groups</span>
            </div>
            <div>
              {user.groups.map((group) => (
                <div key={group.id}>{group.name}</div>
              ))}
            </div>

            <div className="flex items-center space-x-2 font-semibold leading-8 text-gray-900">
              <span className="text-green-500">
                <UserGroupIcon className="h-5" />
              </span>
              <span className="tracking-wide">Sections</span>
            </div>
            <div>
              {user.groups.map((group) => (
                <div key={group.id}>{group.name}</div>
              ))}
            </div>

            <button className="focus:shadow-outline hover:shadow-xs my-4 block w-full rounded-lg p-3 text-sm font-semibold text-blue-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none">
              Show Full Information
            </button>
          </div>

          <div className="my-4"></div>

          <div className="rounded-sm bg-white p-3 shadow-sm">
            <div className="grid grid-cols-2">
              <div>
                <div className="mb-3 flex items-center space-x-2 font-semibold leading-8 text-gray-900">
                  <span className="text-green-500">
                    <PuzzleIcon className="h-5" />
                  </span>
                  <span className="tracking-wide">Challenges</span>
                </div>
                <ul className="list-inside space-y-2">
                  <li>
                    <div className="text-teal-600">
                      Owner at Her Company Inc.
                    </div>
                    <div className="text-xs text-gray-500">
                      March 2020 - Now
                    </div>
                  </li>
                  <li>
                    <div className="text-teal-600">
                      Owner at Her Company Inc.
                    </div>
                    <div className="text-xs text-gray-500">
                      March 2020 - Now
                    </div>
                  </li>
                  <li>
                    <div className="text-teal-600">
                      Owner at Her Company Inc.
                    </div>
                    <div className="text-xs text-gray-500">
                      March 2020 - Now
                    </div>
                  </li>
                  <li>
                    <div className="text-teal-600">
                      Owner at Her Company Inc.
                    </div>
                    <div className="text-xs text-gray-500">
                      March 2020 - Now
                    </div>
                  </li>
                </ul>
              </div>
              <div>
                <div className="mb-3 flex items-center space-x-2 font-semibold leading-8 text-gray-900">
                  <span className="text-green-500">
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
                    <div className="text-teal-600">
                      Masters Degree in Oxford
                    </div>
                    <div className="text-xs text-gray-500">
                      March 2020 - Now
                    </div>
                  </li>
                  <li>
                    <div className="text-teal-600">
                      Bachelors Degreen in LPU
                    </div>
                    <div className="text-xs text-gray-500">
                      March 2020 - Now
                    </div>
                  </li>
                </ul>
              </div>
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
