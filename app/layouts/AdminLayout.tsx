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
    label: "Settings",
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
    label: "Mail List",
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

interface InputProps {
  children: React.ReactElement;
}

const AdminLayout: FC<InputProps> = ({ children }) => {
  const user = useUser();

  return (
    <div className="layout flex flex-col">
      <Header user={user} admin />
      <main className="layout-main container box-content flex-grow overflow-y-auto bg-zinc-100 scrollbar:!h-1.5 scrollbar:!w-1.5 scrollbar:bg-transparent scrollbar-track:mt-2 scrollbar-track:!rounded scrollbar-track:!bg-slate-100 scrollbar-thumb:!rounded scrollbar-thumb:!bg-slate-400">
        <nav>
          <ul className="flex justify-between overflow-x-auto md:justify-center">
            {menuItems
              .filter(({ level }) => {
                if (!level) {
                  return true;
                }
                const userLevel = user?.role;
                if (
                  userLevel === "ADMIN" &&
                  (level === "super" ||
                    level === "group" ||
                    level === "section")
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
                <li
                  key={to}
                  className="border-zinc-400 md:border-r first:md:border-l"
                >
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      `flex flex-col items-center justify-center py-2 px-1 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 hover:text-indigo-900 md:flex-row md:px-4 md:text-base ${
                        isActive && "bg-indigo-100"
                      }`
                    }
                  >
                    <Icon className="h-5 w-5 md:mr-3 md:h-6 md:w-6" />{" "}
                    <span className="whitespace-nowrap">{label}</span>
                  </NavLink>
                </li>
              ))}
          </ul>
        </nav>
        <section className="min-h-[calc(100vh_-_120px)] overflow-x-auto">
          {children}
        </section>
      </main>
    </div>
  );
};

export default AdminLayout;
