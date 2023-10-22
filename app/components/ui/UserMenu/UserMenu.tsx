import { Link, Form } from '@remix-run/react';
import { useRef, useState } from 'react';
import avatarPlaceholder from '#app/assets/images/avatar-placeholder.gif';
import { useClickOutside } from '#app/hooks/useClickOutside.ts';
import { useUser } from '#app/utils/user.ts';

const showUserImg = (picture?: string) => {
  return picture ? (
    <img src={picture} alt="avatar" className="h-10 w-10 rounded-full" />
  ) : (
    <img
      src={avatarPlaceholder}
      alt="avatar"
      className="h-10 w-10 rounded-full"
    />
  );
};

const UserMenu = () => {
  const [open, setOpen] = useState(false);
  const userData = useUser();
  const userRole = userData.roles[0].name;
  const userMenuRef = useRef<HTMLDivElement>(null);
  useClickOutside(userMenuRef, () => setOpen(false));
  return userData !== null ? (
    <div ref={userMenuRef}>
      <button
        className="user-menu flex cursor-pointer items-center border-l border-gray-200"
        onClick={() => setOpen(!open)}
      >
        <div className="user-menu__avatar px-3">{showUserImg()}</div>
        <div className="user-menu__info hidden flex-col justify-center text-gray-50 md:flex">
          <div className="user-menu__info-name text-base font-semibold">
            <span>{userData.name}</span>
          </div>
        </div>
      </button>
      <div
        className={`absolute z-20 mt-2 w-48 rounded-md bg-white py-2 text-left shadow-xl ${
          open ? '' : 'hidden'
        }`}
      >
        <Link
          to="/profile"
          className="block px-4 py-2 text-sm capitalize text-gray-700 hover:bg-blue-500 hover:text-white"
        >
          your profile
        </Link>
        <Link
          to="/challenges?status=started"
          className="block px-4 py-2 text-sm capitalize text-gray-700 hover:bg-blue-500 hover:text-white"
        >
          Your challenges
        </Link>
        <Link
          to="/support"
          className="block px-4 py-2 text-sm capitalize text-gray-700 hover:bg-blue-500 hover:text-white"
        >
          Help
        </Link>
        <Link
          to="/settings/"
          className="block px-4 py-2 text-sm capitalize text-gray-700 hover:bg-blue-500 hover:text-white"
        >
          Settings
        </Link>
        {(userRole === 'ADMIN' ||
          userRole === 'GROUPADMIN' ||
          userRole === 'SECTIONADMIN') && (
          <Link
            to="/admin"
            className="block px-4 py-2 text-sm capitalize text-gray-700 hover:bg-blue-500 hover:text-white"
          >
            Admin
          </Link>
        )}
        <Form action="/logout" method="post" className="w-full">
          <button
            type="submit"
            className="block w-full px-4 py-2 text-left text-sm capitalize text-gray-700 hover:bg-blue-500 hover:text-white"
          >
            Logout
          </button>
        </Form>
      </div>
    </div>
  ) : (
    <div>
      <Link to="/login">Login</Link>
    </div>
  );
};

export default UserMenu;
