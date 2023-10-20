import { Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getSectionListItems } from "~/models/section.server";
import { requireUser } from "~/session.server";
import { AdminList } from "~/components/ui";

export const loader = async ({ request }: LoaderArgs) => {
  const user = await requireUser(request);
  const sectionListItems = await getSectionListItems({
    groupId: user.groups[0]?.id || undefined,
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
