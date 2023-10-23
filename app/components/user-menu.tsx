// import { useSubmit } from '@remix-run/react';
// import { useRef } from 'react';
import { Link } from '@remix-run/react';
import { getUserImgSrc } from '#app/utils/misc.tsx';
import { useUser } from '#app/utils/user.ts';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar.tsx';
import { Button } from './ui/button.tsx';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from './ui/dropdown-menu.tsx';

export default function UserMenu() {
  const user = useUser();
  // const submit = useSubmit();
  // const formRef = useRef<HTMLFormElement>(null);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={getUserImgSrc(user.image?.id)} alt={user.name ?? user.username} />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
          <span className="text-body-sm font-bold hidden lg:block">
            {user.name ?? user.username}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.username}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/me" className='flex w-full justify-between'>
              Profile
              <DropdownMenuShortcut>⇧ Ctrl P</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>New Team</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}