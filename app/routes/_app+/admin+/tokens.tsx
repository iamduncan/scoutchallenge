import { Outlet, useLoaderData } from "@remix-run/react";
import { json, type LoaderFunctionArgs } from "@remix-run/server-runtime";
import { AdminList } from "#app/components/ui/index.ts";
import type { User, Token } from "#app/models/user.server.ts";
import { listTokens } from "#app/models/user.server.ts";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const tokens = await listTokens();
  return json({
    tokens,
  });
};

export default function AdminTokens() {
  const { tokens } = useLoaderData<typeof loader>();
  return (
    <AdminList
      title="Token"
      route="tokens"
      listItems={tokens.map((t) => ({
        name: t.user.name || t.user.username,
        subName: t.user.email,
        id: t.id,
      }))}
      hideNewLink
    >
      <AdminList.Content>
        <Outlet />
      </AdminList.Content>
    </AdminList>
  );
}
