import type { Group, User } from "@prisma/client";
import { Form, Link } from "@remix-run/react";

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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            className="h-10 w-10 rounded-full bg-purple-500 p-2 text-white"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          <span className="ml-3 text-xl">Tailblocks</span>
        </Link>
        <nav className="flex flex-wrap items-center justify-center text-base md:mr-auto	md:ml-4 md:border-l md:border-gray-400 md:py-1 md:pl-4">
          <Link to="/challenges" className="mr-5 hover:text-gray-900">
            Challenges
          </Link>
          <a className="mr-5 hover:text-gray-900">Second Link</a>
          <a className="mr-5 hover:text-gray-900">Third Link</a>
          <a className="mr-5 hover:text-gray-900">Fourth Link</a>
        </nav>
        <button className="mt-4 inline-flex items-center rounded border-0 bg-gray-100 py-1 px-3 text-base hover:bg-gray-200 focus:outline-none md:mt-0">
          Button
          <svg
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            className="ml-1 h-4 w-4"
            viewBox="0 0 24 24"
          >
            <path d="M5 12h14M12 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
    </header>
  );
}
