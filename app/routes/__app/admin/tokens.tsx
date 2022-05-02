import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
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
    <div className="flex h-full flex-col">
      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
          <ol>
            {tokens.map((t) => (
              <li key={t.id} className="group">
                <div className="block px-4 text-xl text-blue-500">
                  {t.user.firstName} {t.user.lastName}
                  <small className="block">{t.user.email}</small>
                  <small className="block">
                    Created:{" "}
                    {t.createdAt &&
                      new Date(t.createdAt).toLocaleString("en-GB")}
                  </small>
                  <small className="block">
                    Expires:{" "}
                    {t.expiresAt &&
                      new Date(t.expiresAt).toLocaleString("en-GB")}
                  </small>
                  <div className="text-transparent group-hover:text-gray-800">
                    <small>{t.token}</small>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </main>
    </div>
  );
}
