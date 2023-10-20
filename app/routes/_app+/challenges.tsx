import { Outlet } from "@remix-run/react";
import { AppLayout } from "~/layouts";

export default function ChallengesPage() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
