import { Outlet } from "@remix-run/react";
import type { LinksFunction, LoaderFunction } from "@remix-run/server-runtime";
import { requireUserId } from "~/session.server";
import layoutStyles from "~/assets/styles/layout.css";

// export const links: LinksFunction = () => [
//   { rel: "stylesheet", href: layoutStyles },
// ];

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);
  return null;
};

export default function App() {
  return <Outlet />;
}
