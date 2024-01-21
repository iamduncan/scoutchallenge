import { NavLink, useLocation } from '@remix-run/react';
import { cn } from '#app/utils/misc.tsx';
import { userHasRole } from '#app/utils/permissions.ts';
import { useUser } from '#app/utils/user.ts';
import { buttonVariants } from './ui/button.tsx';

export interface SidebarNavItem {
  key: string;
  to: string;
  title: string;
  children?: SidebarNavItem[];
}

export interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: (props: { isAdmin?: boolean }) => SidebarNavItem[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const user = useUser();
  const isAdmin = userHasRole(user, 'admin');
  const location = useLocation();
  return (
    <nav
      className={cn(
        'flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1',
        className,
      )}
      {...props}
    >
      {items({
        isAdmin
      }).map((item) => (
        <>
          <NavLink
            key={item.key}
            to={item.to}
            className={({ isActive }) =>
              cn(
                buttonVariants({ variant: 'ghost' }),
                isActive
                  ? 'bg-muted hover:bg-muted'
                  : 'hover:bg-transparent hover:underline',
                'justify-start',
              )
            }
          >
            {item.title}
          </NavLink>
          {(item.children && location.pathname.includes(item.to)) ? item.children.map((child) => (
            <NavLink
              key={child.key}
              to={`${item.to}${child.to}`}
              className={({ isActive }) =>
                cn(
                  buttonVariants({ variant: 'ghost' }),
                  isActive
                    ? 'bg-muted hover:bg-muted'
                    : 'hover:bg-transparent hover:underline',
                  'justify-start !ml-5',
                )
              }
            >
              {child.title}
            </NavLink>
          )) : null}
        </>
      ))}
    </nav>
  );
}
