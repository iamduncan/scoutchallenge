import { Outlet, useMatches } from '@remix-run/react';
import { type LoaderFunction } from '@remix-run/server-runtime';
import { z } from 'zod';
import {
  SidebarNav,
  type SidebarNavProps,
} from '#app/components/sidebar-nav.tsx';
import { Separator } from '#app/components/ui/separator.tsx';
import { requireUserId } from '#app/utils/auth.server.ts';

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);
  return null;
};

const settingsMenu: SidebarNavProps[ 'items' ] = ({ isAdmin }: { isAdmin?: boolean }) => {
  return [
    {
      key: 'profile',
      title: 'Profile',
      to: '/settings/profile',
    },
    {
      key: 'groups',
      title: 'Groups Settings',
      to: '/settings/groups',
    },
    {
      key: 'account',
      title: 'Account',
      to: '/settings/account',
    },
    {
      key: 'security',
      title: 'Security',
      to: '/settings/security',
    },
    {
      key: 'notifications',
      title: 'Notifications',
      to: '/settings/notifications',
    },
    isAdmin ? {
      key: 'integrations',
      title: 'Integrations',
      to: '/settings/integrations',
    } : null,
    isAdmin ? {
      key: 'roles',
      title: 'Roles',
      to: '/settings/roles',
    } : null,
  ].filter(Boolean);
}

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div>
      <div>
        <h3 className="text-lg font-medium">Group Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your group settings.
        </p>
      </div>
      <Separator className="my-3" />
      {children}
    </div>
  );
}

export const SettingsHeaderHandle = z.object({
  settingHeader: z.any(),
});
export type SettingsHeaderHandle = z.infer<typeof SettingsHeaderHandle>;

const SettingsHeaderHandleMatch = z.object({
  handle: SettingsHeaderHandle,
});

export default function SettingsPage() {
  const matches = useMatches();
  const header = matches
    .map((m) => {
      const result = SettingsHeaderHandleMatch.safeParse(m);
      if (!result.success || !result.data.handle.settingHeader) return null;
      return (
        <div key={m.id}>
          <h3 className="text-lg font-medium">
            {result.data.handle.settingHeader.title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {result.data.handle.settingHeader.description}
          </p>
        </div>
      );
    })
    .filter(Boolean);

  return (
    <div className="hidden space-y-6 p-10 pb-16 md:block">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <SidebarNav items={settingsMenu} />
        </aside>
        <div className="flex-1">
          <div className="space-y-6">
            {header}
            {header.length > 0 && <Separator className="my-6" />}
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
