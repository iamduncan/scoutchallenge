import { Outlet } from '@remix-run/react';
import {
  type LinksFunction,
  type LoaderFunction,
} from '@remix-run/server-runtime';
// import layoutStyles from "#app/styles/layout.css";
import { requireUserId } from '#app/utils/auth.server.ts';

export const links: LinksFunction = () => [
  // { rel: "stylesheet", href: layoutStyles },
];

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);
  return null;
};

export default function App() {
  return <Outlet />;
}
