import { Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { AdminList } from "#app/components/ui/index.ts";
import { getChallengeListItems } from "#app/models/challenge.server.ts";
import { getUserId, requireUserId } from '#app/utils/auth.server.ts';
import { getUserById } from '#app/models/user.server.ts';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const user = await getUserById(userId);
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
