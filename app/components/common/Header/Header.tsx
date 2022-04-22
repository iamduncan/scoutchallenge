import { ArrowRightIcon, MapIcon } from "@heroicons/react/outline";
import type { Group, User } from "@prisma/client";
import { Form, Link } from "@remix-run/react";
import { Compass } from "~/components/icons";
import UserMenu from '~/components/ui/UserMenu';

type Props = {
  user: User & { groups: Group[] };
  admin?: boolean;
};

export default function Header(props: Props) {
  const { user } = props;
  return (
    <header className="body-font text-gray-600">
      <div className="container mx-auto flex flex-col flex-wrap items-center p-5 md:flex-row">
        <Link
          to="/"
          className="title-font mb-4 flex items-center font-medium text-gray-900 md:mb-0"
        >
          <MapIcon className="h-10 w-10 rounded-full bg-purple-600 p-2 text-white" />
          <span className="ml-3 text-xl">Scout Challenge</span>
        </Link>
        <nav className="flex flex-wrap items-center justify-center text-base md:mr-auto	md:ml-4 md:border-l md:border-gray-400 md:py-1 md:pl-4">
          <Link to="/challenges" className="mr-5 hover:text-gray-900">
            Challenges
          </Link>
          <a className="mr-5 hover:text-gray-900">Second Link</a>
          <a className="mr-5 hover:text-gray-900">Third Link</a>
          <a className="mr-5 hover:text-gray-900">Fourth Link</a>
        </nav>
        <UserMenu />
      </div>
    </header>
  );
}
