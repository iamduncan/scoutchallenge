import { Outlet } from "@remix-run/react";
import { AppLayout } from "#app/layouts/index.ts";

export default function ChallengesPage() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
