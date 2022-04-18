import type { FC } from "react";

const AdminLayout: FC = ({ children }) => {
  return (
    <div className="flex h-screen flex-row-reverse">
      <div className="flex flex-grow flex-col">
        <div className="text-center">Header</div>
        <main className="flex-grow">{children}</main>
        <div className="text-center">Footer</div>
      </div>
      <aside className="basis-1/5">
        <div className="text-center">Sidebar</div>
        <ul className="">
          <li className="py-2 px-3 font-semibold text-indigo-700 hover:bg-indigo-100 hover:text-indigo-900">
            Sections
          </li>
          <li className="py-2 px-3 font-semibold text-indigo-700 hover:bg-indigo-100 hover:text-indigo-900">
            Challenges
          </li>
          <li className="py-2 px-3 font-semibold text-indigo-700 hover:bg-indigo-100 hover:text-indigo-900">
            Responses
          </li>
          <li className="py-2 px-3 font-semibold text-indigo-700 hover:bg-indigo-100 hover:text-indigo-900">
            Messages
          </li>
          <li className="py-2 px-3 font-semibold text-indigo-700 hover:bg-indigo-100 hover:text-indigo-900">
            Group Settings
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default AdminLayout;
