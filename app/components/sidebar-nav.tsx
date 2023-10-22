import { NavLink } from '@remix-run/react';
import { cn } from '#app/utils/misc.tsx';
import { buttonVariants } from './ui/button.tsx';

export interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    key: string;
    to: string;
    title: string;
  }[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  return (
    <nav
      className={cn(
        'flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1',
        className,
      )}
      {...props}
    >
      {items.map((item) => (
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
