import { TrashIcon } from '@heroicons/react/24/outline';
import { Form, NavLink, useLocation } from '@remix-run/react';
import React, { type FC, createContext } from 'react';

type AdminListContextType = {
  title: string;
  route: string;
  listItems: {
    id: string;
    name: string;
    subName?: string;
  }[];
  children?: React.ReactNode;
  hideNewLink?: boolean;
  hideDelete?: boolean;
};

const AdminListContext = createContext<AdminListContextType>({
  title: '',
  route: '',
  listItems: [],
  hideNewLink: false,
  hideDelete: false,
});

const Title = () => {
  return (
    <AdminListContext.Consumer>
      {({ title }) => <h1 className="text-xl font-medium">{title}</h1>}
    </AdminListContext.Consumer>
  );
};

const ListItems = ({
  isRoot,
  hideNewLink,
  hideDelete,
}: {
  isRoot: boolean;
  hideNewLink?: boolean;
  hideDelete?: boolean;
}) => {
  return (
    <AdminListContext.Consumer>
      {({ title, listItems }) => (
        <div
          className={`h-full flex-none border-r bg-gray-50 md:basis-80 ${
            isRoot ? 'w-full' : 'hidden lg:block'
          }`}
        >
          {!hideNewLink && (
            <>
              <NavLink
                to="new"
                className={({ isActive }) =>
                  `block p-4 text-xl text-blue-500 ${
                    isActive ? 'bg-white' : ''
                  }`
                }
              >
                + New {title}
              </NavLink>
              <hr />
            </>
          )}
          <ol className="list-inside list-disc">
            {listItems.map((item, index) => (
              <li
                key={item.id}
                className="flex items-center justify-between border-b p-4 text-xl"
              >
                <NavLink
                  className={({ isActive }) =>
                    `block h-full w-full ${isActive ? 'bg-white' : ''}`
                  }
                  to={item.id}
                >
                  {item.name}
                  {item.subName && (
                    <div>
                      <small>{item.subName}</small>
                    </div>
                  )}
                </NavLink>
                {!hideDelete && (
                  <Form method="delete" action={item.id}>
                    <button type="submit" className="text-red-500">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </Form>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}
    </AdminListContext.Consumer>
  );
};

const Content: FC<{ children: React.ReactElement }> = ({ children }) => {
  return <>{children}</>;
};

const AdminList = (props: AdminListContextType) => {
  const paths = useLocation().pathname.split('/');
  const isSectionRoot = paths[paths.length - 1] === props.route;
  return (
    <AdminListContext.Provider value={props}>
      <div className="flex h-full min-h-full flex-none">
        <ListItems
          isRoot={isSectionRoot}
          hideNewLink={props.hideNewLink}
          hideDelete={props.hideDelete}
        />
        <div
          className={`h-full flex-grow p-6 ${
            isSectionRoot && 'hidden lg:block'
          }`}
        >
          {props.children}
        </div>
      </div>
    </AdminListContext.Provider>
  );
};

AdminList.Title = Title;
AdminList.ListItems = ListItems;
AdminList.Content = Content;

export default AdminList;
