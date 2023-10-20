import { Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { AdminList } from "~/components/ui";
import { getChallengeListItems } from "~/models/challenge.server";
import { getUser } from "~/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  const user = await getUser(request);
  const challenges = await getChallengeListItems({
    groups: user?.groups,
  });
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
