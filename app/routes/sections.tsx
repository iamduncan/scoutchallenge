import { Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Header } from "~/components/common";
import { getSectionListItems } from "~/models/section.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

type LoaderData = {
  sectionListItems: Awaited<ReturnType<typeof getSectionListItems>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const sectionListItems = await getSectionListItems({ userId: userId });
  return json<LoaderData>({ sectionListItems });
};

export default function SectionsPage() {
  const data = useLoaderData() as LoaderData;
  const user = useUser();
  return (
    <div className="flex h-full min-h-screen flex-col">
      <Header user={user} title="Sections" />

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
              {data.sectionListItems.map((note) => (
                <li key={note.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                    }
                    to={note.id}
                  >
                    📝 {note.name}
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
