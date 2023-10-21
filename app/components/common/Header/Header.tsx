import { Bars3Icon } from "@heroicons/react/24/outline";
import { Form, Link, NavLink } from "@remix-run/react";
import { useState } from "react";
import { Logo } from "#app/components/icons/index.ts";
import { menuItems } from "#app/config.ts";

type Props = {
  user: {
    id: string;
    username: string;
    name: string | null;
    image: {
      id: string;
    } | null;
    groups: {
      id: string;
      name: string;
    }[];
    roles: {
      name: string;
      permissions: {
        action: string;
        entity: string;
        access: string;
      }[];
    }[];
  };
  admin?: boolean;
};

export default function Header(props: Props) {
  const { user, admin } = props;
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header
      className={`body-font bg-scout-purple px-4 py-2 text-gray-600 ${
        !admin && "md:pb-16"
      }`}
    >
      <div className="flex w-full items-center justify-between">
        <Link to="/" className="title-font text-gray-100 md:mb-0">
          <Logo className="h-12 w-12" />
        </Link>

        <Link to="/" className="title-font md:mb-0">
          <h1 className="text-xl font-medium text-gray-100">Scout Challenge</h1>
        </Link>
        <div>
          <button id="open-menu" onClick={() => setIsOpen(!isOpen)}>
            <Bars3Icon className="h-10 w-10 text-gray-100" />
          </button>
        </div>
      </div>
      <nav
        className={`${
          !isOpen && "hidden"
        } fixed top-0 left-0 z-50 h-screen w-full bg-white p-3`}
      >
        <div className="flex- flex items-center justify-between px-3 py-2">
          <Logo className="h-12 w-12 rounded-full bg-purple-600 p-2 text-gray-100" />
          <h1 className="text-xl font-semibold text-gray-800">
            Scout Challenge
          </h1>
          <button
            type="button"
            id="close-menu"
            className="close-menu flex content-center items-center justify-center rounded bg-gray-800 px-2 py-1 uppercase text-white"
            onClick={() => setIsOpen(false)}
          >
            Close
          </button>
        </div>
        <ul className="mt-2 flex w-full flex-col pt-2 text-center">
          {menuItems
            .filter((item) => {
              if (!item.forAdmin) {
                return true;
              }
              return user.roles.some(
                (role) =>
                  role.name === "ADMIN" ||
                  role.name === "GROUPADMIN" ||
                  role.name === "SECTIONADMIN",
              );
            })
            .map((item) => (
              <li key={item.id} className="w-full">
                <NavLink
                  className="block w-full border-t border-gray-200 py-3 text-lg font-bold"
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          <li className="w-full">
            <Link
              className="block w-full border-t border-gray-200 py-3 text-lg"
              to="/support"
            >
              Contact
            </Link>
          </li>
          <li className="w-full">
            <Form action="/logout" method="post" className="w-full">
              <button
                type="submit"
                className="block w-full border-t border-gray-200 py-3 text-lg"
              >
                Logout
              </button>
            </Form>
          </li>
        </ul>
      </nav>
    </header>
  );
}
