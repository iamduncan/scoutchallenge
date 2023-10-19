import type {
  LinksFunction,
  LoaderFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { cssBundleHref } from "@remix-run/css-bundle";

import tailwindStylesheetUrl from "./styles/app.css";
import editorStylesheetUrl from "./components/ui/Editor/styles.css";

import { useOptionalUser } from "#app/utils/user.ts";
import { makeTimings, time } from "./utils/timing.server.ts";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwindStylesheetUrl },
    { rel: "stylesheet", href: editorStylesheetUrl },
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com/",
      crossOrigin: "anonymous",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Nunito&display=swap",
    },
    {
      rel: "manifest",
      href: "/app.webmanifest",
    },
  ];
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data ? "Scout Challenge" : "Error | Scout Challenge" },
    { name: "description", content: "Scout Challenge" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const timings = makeTimings("root loader");
  const userId = await time(() => getUserId(request), {
    timings,
    type: "getUserId",
    desc: "getUserId in root",
  });

  const user = userId
    ? await time(
        () =>
          prisma.user.findUniqueOrThrow({
            select: {
              id: true,
              name: true,
              username: true,
              image: { select: { id: true } },
              roles: {
                select: {
                  name: true,
                  permissions: {
                    select: { entity: true, action: true, access: true },
                  },
                },
              },
            },
            where: { id: userId },
          }),
        { timings, type: "find user", desc: "find user in root" },
      )
    : null;
  if (userId && !user) {
    console.info("something weird happened");
    // something weird happened... The user is authenticated but we can't find
    // them in the database. Maybe they were deleted? Let's log them out.
    // await authenticator.logout(request, { redirectTo: "/" });
  }

  return json({
    user,
    requestInfo: {
      hints: {},
    },
  });
};

export default function App() {
  return (
    <html lang="en" className="" suppressHydrationWarning>
      <head suppressHydrationWarning>
        <Meta />
        <Links />
      </head>
      <body
        className="h-full max-w-full overflow-y-auto"
        suppressHydrationWarning
      >
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
