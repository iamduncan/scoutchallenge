import { type LoaderFunction } from '@remix-run/node';
import { Outlet, useMatches } from '@remix-run/react';
import {
  Bell,
  Blocks,
  Building,
  Cog,
  KeyRound,
  Notebook,
  UserCircle,
  Wrench,
} from 'lucide-react';
import { z } from 'zod';
import {
  SidebarNav,
  type SidebarNavProps,
} from '#app/components/settings-sidebar.tsx';
import { Separator } from '#app/components/ui/separator';
import { requireUserId } from '#app/utils/auth.server.ts';

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);
  return null;
};

const settingsMenu: SidebarNavProps['items'] = ({
  admin,
}: {
  admin?: {
    isAdmin?: boolean;
  };
}) => {
  return [
    {
      key: 'profile',
      title: 'Profile',
      to: '/settings/profile',
      icon: <UserCircle size={20} />,
    },
    {
      key: 'account',
      title: 'Account',
      to: '/settings/account',
      icon: <Cog size={20} />,
    },
    {
      key: 'security',
      title: 'Security',
      to: '/settings/security',
      icon: <KeyRound size={20} />,
    },
    {
      key: 'notifications',
      title: 'Notifications',
      to: '/settings/notifications',
      icon: <Bell size={20} />,
    },
    {
      key: 'company',
      title: 'Company Settings',
      to: '/settings/company',
      icon: <Building size={20} />,
    },
    admin?.isAdmin
      ? {
          key: 'integrations',
          title: 'Integrations',
          to: '/settings/integrations',
          icon: <Blocks size={20} />,
          children: [
            {
              key: 'ebay',
              title: 'eBay',
              to: '/ebay',
            },
          ],
        }
      : null,
    admin?.isAdmin
      ? {
          key: 'roles',
          title: 'Roles',
          to: '/settings/roles',
          icon: <Notebook size={20} />,
        }
      : null,
    admin?.isAdmin
      ? {
          key: 'system',
          title: 'System',
          to: '/settings/system',
          icon: <Wrench size={20} />,
        }
      : null,
  ].filter(Boolean);
};

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
  settingHeader: z
    .function()
    .args(
      z.object({
        match: z.any(),
      }),
    )
    .returns(
      z.object({
        title: z.string(),
        description: z.string(),
      }),
    ),
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
      const headerData = result.data.handle.settingHeader({ match: m });
      return (
        <div key={m.id}>
          <h3 className="text-lg font-medium">{headerData.title}</h3>
          <p className="text-sm text-muted-foreground">
            {headerData.description}
          </p>
        </div>
      );
    })
    .filter(Boolean);

  return (
    <div className="flex h-full flex-col px-6">
      <div className="flex h-full flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <SidebarNav items={settingsMenu} />
        </aside>
        <div className="flex grow flex-col">
          {header}
          {header.length > 0 && <Separator className="my-6" />}
          <Outlet />
        </div>
      </div>
    </div>
  );
}