import type { FC } from "react";
import { Link, NavLink } from "@remix-run/react";
import {
  ChatIcon,
  CogIcon,
  InboxInIcon,
  PuzzleIcon,
  UserGroupIcon,
} from "@heroicons/react/outline";
import { Header } from "~/components/common";
import { useUser } from "~/utils";

const AppLayout: FC = ({ children }) => {
  const user = useUser();
  return (
    <div className="flex h-screen flex-row-reverse">
      <div className="flex flex-grow flex-col">
        <div className="text-center">
          <Header user={user} />
        </div>
        <main className="flex-grow">{children}</main>
        <div className="text-center">Footer</div>
      </div>
    </div>
  );
};

export default AppLayout;
