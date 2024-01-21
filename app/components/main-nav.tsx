import { NavLink } from '@remix-run/react';
import { cn } from '#app/utils/misc.tsx';
import { userHasRole } from '#app/utils/permissions.ts';
import { useUser } from '#app/utils/user.ts';
import { Separator } from './ui/separator.tsx';

export function MainNav({
  className,
  ...props
}: Readonly<React.HTMLAttributes<HTMLElement>>) {
  const user = useUser();
  const userIsAdmin = userHasRole(user, "admin");
  return (
    <nav
      className={cn("flex items-center h-10 space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <NavLink
        to="/dashboard"
        className={({ isActive }) => cn(
          "text-sm font-medium transition-colors hover:text-primary hover:underline", 
          isActive ? "text-primary" : "text-muted-foreground"
        )}
      >
        Dashboard
      </NavLink>
      <NavLink
        to="/challenges"
        className={({ isActive }) => cn("text-sm font-medium transition-colors hover:text-primary hover:underline", isActive ? "text-primary" : "text-muted-foreground")}
      >
        My Challenges
      </NavLink>
      <NavLink
        to="/rewards"
        className={({ isActive }) => cn("text-sm font-medium transition-colors hover:text-primary hover:underline", isActive ? "text-primary" : "text-muted-foreground")}
      >
        My Rewards
      </NavLink>
      {userIsAdmin && (
        <>
          <Separator orientation='vertical' />
          <NavLink
            to="/admin/groups"
            className={({ isActive }) => cn("text-sm font-medium transition-colors hover:text-blue-500 hover:underline", isActive ? "text-blue-500" : "text-blue-700")}
            title='Groups Admin'
          >
            Groups
          </NavLink>
          <NavLink
            to="/admin/challenges"
            className={({ isActive }) => cn("text-sm font-medium transition-colors hover:text-blue-500 hover:underline", isActive ? "text-blue-500" : "text-blue-700")}
            title='Challenges Admin'
          >
            Challenges
          </NavLink>
          <NavLink
            to="/admin/rewards"
            className={({ isActive }) => cn("text-sm font-medium transition-colors hover:text-blue-500 hover:underline", isActive ? "text-blue-500" : "text-blue-700")}
            title='Rewards Admin'
          >
            Rewards
          </NavLink>
        </>
      )}
    </nav>
  )
}