import {
  BellIcon,
  CogIcon,
  KeyIcon,
  UserCircleIcon,
  ViewGridAddIcon,
} from "@heroicons/react/outline";
import { NavLink, Outlet } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { AppLayout } from "~/layouts";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);
  return null;
};

const settingsMenu = [
  {
    key: "profile",
    label: "Profile",
    icon: UserCircleIcon,
    to: "/settings/profile",
  },
  {
    key: "account",
    label: "Account",
    icon: CogIcon,
    to: "/settings/account",
  },
  {
    key: "security",
    label: "Security",
    icon: KeyIcon,
    to: "/settings/security",
  },
  {
    key: "notifications",
    label: "Notifications",
    icon: BellIcon,
    to: "/settings/notifications",
    enabled: false,
  },
  {
    key: "integrations",
    label: "Integrations",
    icon: ViewGridAddIcon,
    to: "/settings/integrations",
    enabled: false,
  },
];

export default function SettingsPage() {
  const user = useUser();
  return (
    <AppLayout>
      <div className="flex h-full">
        <div className="basis-1/5 border-r">
          {settingsMenu
            .filter((item) =>
              item.enabled !== false ? true : user.role === "ADMIN"
            )
            .map((menuItem) => (
              <NavLink
                to={menuItem.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 border-l-4 border-transparent py-3 px-2 ${
                    isActive &&
                    "border-purple-600 bg-purple-200 font-semibold text-purple-700"
                  }`
                }
                key={menuItem.key}
              >
                <menuItem.icon className="h-6 w-6" /> {menuItem.label}
              </NavLink>
            ))}
        </div>
        <div className="flex-grow p-4">
          <Outlet />
        </div>
      </div>
    </AppLayout>
  );
}
