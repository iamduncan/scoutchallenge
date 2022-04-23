import type { FC } from "react";
import { NavLink } from "@remix-run/react";
import {
  ChatIcon,
  CogIcon,
  InboxInIcon,
  PuzzleIcon,
  UserGroupIcon,
} from "@heroicons/react/outline";
import { Header } from "~/components/common";
import { useUser } from "~/utils";

const AdminLayout: FC = ({ children }) => {
  const user = useUser();

  return (
    <div className="flex h-screen flex-row-reverse">
      <div className="flex flex-grow flex-col">
        <div className="text-center">
          <Header user={user} admin />
        </div>
        <main className="flex-grow">{children}</main>
        <div className="text-center">Footer</div>
      </div>
      <aside className="min-w-[225px] basis-1/5 border-r bg-slate-100">
        <div className="p-6 text-center">
          <h2>Sidebar</h2>
        </div>
        <ul className="md:text-lg">
          <li>
            <NavLink
              to="/admin/sections"
              className={({ isActive }) =>
                `flex items-center py-2 pl-8 font-semibold text-indigo-700 hover:bg-indigo-100 hover:text-indigo-900 ${
                  isActive && "bg-indigo-100"
                }`
              }
            >
              <UserGroupIcon className="mr-3 h-6 w-6" /> Sections
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/challenges"
              className={({ isActive }) =>
                `flex items-center py-2 pl-8 font-semibold text-indigo-700 hover:bg-indigo-100 hover:text-indigo-900 ${
                  isActive && "bg-indigo-100"
                }`
              }
            >
              <PuzzleIcon className="mr-3 h-6 w-6" /> Challenges
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/responses"
              className={({ isActive }) =>
                `flex items-center py-2 pl-8 font-semibold text-indigo-700 hover:bg-indigo-100 hover:text-indigo-900 ${
                  isActive && "bg-indigo-100"
                }`
              }
            >
              <InboxInIcon className="mr-3 h-6 w-6" /> Responses
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/messages"
              className={({ isActive }) =>
                `flex items-center py-2 pl-8 font-semibold text-indigo-700 hover:bg-indigo-100 hover:text-indigo-900 ${
                  isActive && "bg-indigo-100"
                }`
              }
            >
              <ChatIcon className="mr-3 h-6 w-6" /> Messages
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/settings"
              className={({ isActive }) =>
                `flex items-center py-2 pl-8 font-semibold text-indigo-700 hover:bg-indigo-100 hover:text-indigo-900 ${
                  isActive && "bg-indigo-100"
                }`
              }
            >
              <CogIcon className="mr-3 h-6 w-6" /> Group Settings
            </NavLink>
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default AdminLayout;
