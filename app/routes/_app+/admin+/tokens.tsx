import { Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { AdminList } from "~/components/ui";
import type { User, Token } from "~/models/user.server";
import { listTokens } from "~/models/user.server";

export const loader: LoaderFunction = async () => {
  const tokens = await listTokens();
  return {
    tokens,
  };
};

export default function AdminTokens() {
  const { tokens } = useLoaderData<{ tokens: (Token & { user: User })[] }>();
  return (
    <AdminList
      title="Token"
      route="tokens"
      listItems={tokens.map((t) => ({
        name: `${t.user.firstName} ${t.user.lastName}`,
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
