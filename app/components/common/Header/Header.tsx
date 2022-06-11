import { MenuIcon } from "@heroicons/react/outline";
import type { Group, User } from "@prisma/client";
import { Link, NavLink } from "@remix-run/react";
import { useState } from "react";
import { Logo } from "~/components/icons";
import { UserMenu } from "~/components/ui";
import { menuItems } from "~/config";

type Props = {
  user: User & { groups: Group[] };
  admin?: boolean;
};

export default function Header(props: Props) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header
      className={`body-font bg-scout-purple px-4 py-2 text-gray-600 ${
        !props.admin && "md:pb-16"
      }`}
    >
      <div className="flex w-full items-center justify-between">
        <Link to="/" className="title-font text-gray-100 md:mb-0">
          <Logo className="h-12 w-12" />
        </Link>

        <Link to="/" className="title-font md:mb-0">
          <h1 className="text-xl font-semibold text-gray-100">
            Scout Challenge
          </h1>
        </Link>

        <MenuIcon
          className="h-10 w-10 text-gray-100"
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
      <nav
        className={`${
          !isOpen && "hidden"
        } fixed top-0 left-0 z-50 h-screen w-full bg-white p-3 md:hidden`}
      >
        <div className="flex- flex items-center justify-between px-3 py-2">
          <Logo className="h-10 w-10 rounded-full bg-purple-600 p-2 text-gray-100" />
          <h1 className="text-xl font-semibold text-gray-800">
            Scout Challenge
          </h1>
          <div
            className="close-menu flex content-center items-center justify-center rounded bg-gray-800 px-2 py-1 uppercase text-white"
            onClick={() => setIsOpen(false)}
          >
            Close
          </div>
        </div>
        <ul className="mt-2 flex w-full flex-col pt-2 text-center">
          <li className="active w-full">
            <Link
              className="block w-full border-t border-gray-200 py-3 text-lg font-bold"
              to="/"
            >
              Home
            </Link>
          </li>
          <li className="w-full">
            <Link
              className="block w-full border-t border-gray-200 py-3 text-lg"
              to="/contact"
            >
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

const old = () => (
  <div className="container mx-auto flex flex-col flex-wrap items-center p-5 md:flex-row">
    <Link
      to="/"
      className="title-font mb-4 flex items-center text-gray-100 md:mb-0"
    >
      <Logo className="h-10 w-10 rounded-full bg-purple-600 p-2" />
      <span className="ml-3 text-xl font-semibold">Scout Challenge</span>
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
);
