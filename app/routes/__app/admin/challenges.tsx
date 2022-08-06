import { TrashIcon } from "@heroicons/react/outline";
import type { Challenge } from "@prisma/client";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { AdminList } from "~/components/ui";
import { getChallengeListItems } from "~/models/challenge.server";

export const loader: LoaderFunction = async () => {
  const challenges = await getChallengeListItems();
  return json({ challenges });
};

export default function ChallengesPage() {
  const { challenges } = useLoaderData<{ challenges: Challenge[] }>();

  return (
    <AdminList title="Challenge" route="challenges" listItems={challenges}>
      <AdminList.Content>
        <Outlet />
      </AdminList.Content>
    </AdminList>
  );
}
