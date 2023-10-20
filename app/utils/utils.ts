import  { type Group } from "@prisma/client";
import { useRouteLoaderData } from "@remix-run/react";
import  { type User } from "#app/models/user.server.ts";
import { type loader as rootLoader } from "#app/root.tsx";

function isUser(user: any): user is User & { groups: Group[] } {
  return user && typeof user === "object" && typeof user.email === "string";
}

export function useOptionalUser(): (User & { groups: Group[] }) | undefined {
  const data = useRouteLoaderData<typeof rootLoader>("root");
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

export function useUser(): User & { groups: Group[] } {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead.",
    );
  }
  return maybeUser;
}

export function validateEmail(email: unknown): email is string {
  return (
    typeof email === "string" &&
    email.length > 3 &&
    email.includes("@") &&
    (String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      )
      ? true
      : false)
  );
}
