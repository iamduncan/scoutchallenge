import type { Group, User } from "@prisma/client";
import { Form, Link } from "@remix-run/react";

type Props = {
  user: User & { groups: Group[] };
  title: string;
};

export default function Header(props: Props) {
  const { user, title } = props;
  return (
    <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
      <h1 className="text-3xl font-bold">
        <Link to=".">{title}</Link>
      </h1>
      <p>
        {user.firstName} {user.lastName} ({user.groups[0]?.name})
      </p>
      <Form action="/logout" method="post">
        <button
          type="submit"
          className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
        >
          Logout
        </button>
      </Form>
    </header>
  );
}
