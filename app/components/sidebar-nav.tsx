import { NavLink } from '@remix-run/react';
import { cn } from '#app/utils/misc.tsx';
import { buttonVariants } from './ui/button.tsx';
import { userHasRole } from '#app/utils/permissions.ts';
import { useUser } from '#app/utils/user.ts';

export interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: (props: { isAdmin?: boolean}) => {
  key: string;
  to: string;
  title: string;
} [];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const user = useUser();
  const isAdmin = userHasRole(user, 'admin');
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
      ))}
    </nav>
  );
}
