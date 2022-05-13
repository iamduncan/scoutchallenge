import type { Challenge } from "@prisma/client";
import { Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { listChallenges } from "~/models/challenge.server";

export const loader: LoaderFunction = async () => {
  const challenges = await listChallenges();
  return json({ challenges });
};

export default function ChallengesPage() {
  const { challenges } = useLoaderData<{ challenges: Challenge[] }>();

  return (
    <div className="flex h-full flex-col">
      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
          <Link to="new" className="block p-4 text-xl text-blue-500">
            + New Challenge
          </Link>

          <hr />

          <ol>
            {challenges.map((challenge) => (
              <li key={challenge.id}>
                <NavLink
                  className={({ isActive }) =>
                    `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                  }
                  to={`/admin/challenges/${challenge.id}`}
                >
                  {challenge.name}
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
