import type { FC, SVGProps } from "react";
import { NavLink } from "@remix-run/react";
import {
  ChatIcon,
  CogIcon,
  CollectionIcon,
  InboxInIcon,
  PuzzleIcon,
  TicketIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/outline";
import { Header } from "~/components/common";
import { useUser } from "~/utils";

const menuItems: {
  icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  label: string;
  to: string;
  level?: "super" | "group" | "section";
}[] = [
  {
    icon: UserGroupIcon,
    label: "Sections",
    to: "/admin/sections",
    level: "group",
  },
  {
    icon: PuzzleIcon,
    label: "Challenges",
    to: "/admin/challenges",
    level: "section",
  },
  {
    icon: InboxInIcon,
    label: "Responses",
    to: "/admin/responses",
    level: "section",
  },
  {
    icon: ChatIcon,
    label: "Messages",
    to: "/admin/messages",
    level: "section",
  },
  {
    icon: CogIcon,
    label: "Group Settings",
    to: "/admin/settings",
    level: "group",
  },
  {
    icon: UserIcon,
    label: "Users",
    to: "/admin/users",
    level: "super",
  },
  {
    icon: CollectionIcon,
    label: "Mailing List",
    to: "/admin/mailing-list",
    level: "super",
  },
  {
    icon: TicketIcon,
    label: "Tokens",
    to: "/admin/tokens",
    level: "super",
  },
];

const AdminLayout: FC = ({ children }) => {
  const user = useUser();

  return (
    <div className="flex h-full flex-row-reverse overflow-y-auto">
      <div className="flex flex-grow flex-col">
        <div className="text-center">
          <Header user={user} admin />
        </div>
        <main className="flex-grow">{children}</main>
        <div className="text-center">Footer</div>
      </div>
      <aside className="hidden min-w-[225px] flex-none basis-1/5 border-r bg-slate-100 md:block">
        <div className="p-6 text-center">
          <h2>Sidebar</h2>
        </div>
        <ul className="md:text-lg">
          {menuItems
            .filter(({ level }) => {
              if (!level) {
                return true;
              }
              const userLevel = user?.role;
              if (
                userLevel === "ADMIN" &&
                (level === "super" || level === "group" || level === "section")
              ) {
                return true;
              }
              if (
                userLevel === "GROUPADMIN" &&
                (level === "group" || level === "section")
              ) {
                return true;
              }
              if (userLevel === "SECTIONADMIN" && level === "section") {
                return true;
              }
              return false;
            })
            .map(({ icon: Icon, label, to }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center py-2 pl-8 font-semibold text-indigo-700 hover:bg-indigo-100 hover:text-indigo-900 ${
                      isActive && "bg-indigo-100"
                    }`
                  }
                >
                  <Icon className="mr-3 h-6 w-6" /> {label}
                </NavLink>
              </li>
            ))}
        </ul>
      </aside>
    </div>
  );
};

export default AdminLayout;
