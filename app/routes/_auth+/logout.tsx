import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { logout } from "#app/utils/auth.server.ts";

export const action: ActionFunction = async ({ request }) => {
  return logout({ request });
};

export const loader: LoaderFunction = async () => {
  return redirect("/");
};
