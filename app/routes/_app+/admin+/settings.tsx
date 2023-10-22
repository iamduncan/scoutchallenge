import { Link, NavLink, Outlet } from '@remix-run/react';

export default function SettingsPage() {
  return (
    <div className="flex h-full flex-col">
      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
          <Link to="./" className="block p-4 text-xl text-blue-500">
            + New Setting
          </Link>

          <hr />

          <ol>
            <li>
              <NavLink
                className={({ isActive }) =>
                  `block border-b p-4 text-xl ${isActive ? 'bg-white' : ''}`
                }
                to="./"
              >
                📝 Setting 1
              </NavLink>
            </li>
          </ol>
        </div>

        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
