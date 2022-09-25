import { Outlet, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";
import { AdminList } from "~/components/ui";
import { getChallengeListItems } from "~/models/challenge.server";

export const loader = async () => {
  const challenges = await getChallengeListItems();
  return json({ challenges });
};

export default function ChallengesPage() {
  const { challenges } = useLoaderData<typeof loader>();

  return (
    <AdminList title="Challenge" route="challenges" listItems={challenges}>
      <AdminList.Content>
        <Outlet />
      </AdminList.Content>
    </AdminList>
  );
}
