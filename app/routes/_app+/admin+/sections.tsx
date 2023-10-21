import  { type LoaderFunctionArgs , json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { AdminList } from "#app/components/ui/index.ts";
import { getSectionListItems } from "#app/models/section.server.ts";
import { getUserById } from '#app/models/user.server.ts';
import { requireUserId } from '#app/utils/auth.server.ts';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const user = await getUserById(userId);
  if (!user) throw redirect("/login");
  const sectionListItems = await getSectionListItems({
    groupId: user.groups[ 0 ]?.id || undefined,
  });
  return json({ sectionListItems });
};

export default function SectionsPage() {
  const { sectionListItems } = useLoaderData<typeof loader>();
  return (
    <AdminList title="Section" route="sections" listItems={sectionListItems}>
      <AdminList.Content>
        <Outlet />
      </AdminList.Content>
    </AdminList>
  );
}