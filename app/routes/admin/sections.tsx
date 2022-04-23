import { Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getSectionListItems } from "~/models/section.server";
import { requireUser } from "~/session.server";

type LoaderData = {
  sectionListItems: Awaited<ReturnType<typeof getSectionListItems>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request);
  const sectionListItems = await getSectionListItems({
    groupId: user.groups[0]?.id || undefined,
  });
  return json<LoaderData>({ sectionListItems });
};

export default function SectionsPage() {
  const data = useLoaderData() as LoaderData;
  return (
    <div className="flex h-full flex-col">
      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
          <Link to="new" className="block p-4 text-xl text-blue-500">
            + New Section
          </Link>

          <hr />

          {data.sectionListItems.length === 0 ? (
            <p className="p-4">No sections yet</p>
          ) : (
            <ol>
              {data.sectionListItems.map((section) => (
                <li key={section.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                    }
                    to={section.id}
                  >
                    📝 {section.name}
                  </NavLink>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
