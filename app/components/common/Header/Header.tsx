import { MapIcon } from "@heroicons/react/outline";
import type { Group, User } from "@prisma/client";
import { Link, NavLink } from "@remix-run/react";
import { UserMenu } from "~/components/ui";
import { menuItems } from "~/config";

type Props = {
  user: User & { groups: Group[] };
  admin?: boolean;
};

export default function Header(props: Props) {
  return (
    <header
      className={`body-font bg-purple-500 text-gray-600 ${
        !props.admin && "pb-16"
      }`}
    >
      <div className="container mx-auto flex flex-col flex-wrap items-center p-5 md:flex-row">
        <Link
          to="/"
          className="title-font mb-4 flex items-center font-medium text-gray-900 md:mb-0"
        >
          <MapIcon className="h-10 w-10 rounded-full bg-purple-600 p-2 text-white" />
          <span className="ml-3 text-xl">Scout Challenge</span>
        </Link>
        <nav className="flex flex-wrap items-center justify-center text-base md:mr-auto	md:ml-4 md:border-l md:border-gray-200 md:pl-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `mr-5 font-semibold text-gray-50 hover:text-gray-200 md:p-1 ${
                  isActive && "rounded bg-purple-200 !text-gray-800"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <UserMenu />
      </div>
    </header>
  );
}
