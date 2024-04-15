import { type LoaderFunction } from '@remix-run/node'
import { Outlet, useMatches } from '@remix-run/react'
import { z } from 'zod'
import {
	SidebarNav,
	type SidebarNavProps,
} from '#app/components/settings-sidebar.tsx'
import { Icon } from '#app/components/ui/icon'
import { Separator } from '#app/components/ui/separator'
import { requireUserId } from '#app/utils/auth.server.ts'

export const loader: LoaderFunction = async ({ request }) => {
	await requireUserId(request)
	return null
}

const iconSize = 'md'

const settingsMenu: SidebarNavProps['items'] = ({
	admin,
}: {
	admin?: {
		isAdmin?: boolean
	}
}) => {
	return [
		{
			key: 'profile',
			title: 'Profile',
			to: '/settings/profile',
			icon: <Icon name="circle-user" size={iconSize} />,
		},
		{
			key: 'account',
			title: 'Account',
			to: '/settings/account',
			icon: <Icon name="settings" size={iconSize} />,
		},
		{
			key: 'security',
			title: 'Security',
			to: '/settings/security',
			icon: <Icon name="key-round" size={iconSize} />,
		},
		{
			key: 'notifications',
			title: 'Notifications',
			to: '/settings/notifications',
			icon: <Icon name="bell" size={iconSize} />,
		},
		{
			key: 'company',
			title: 'Company Settings',
			to: '/settings/company',
			icon: <Icon name="building" size={iconSize} />,
		},
		admin?.isAdmin
			? {
					key: 'integrations',
					title: 'Integrations',
					to: '/settings/integrations',
					icon: <Icon name="blocks" size={iconSize} />,
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
					icon: <Icon name="notebook" size={iconSize} />,
				}
			: null,
		admin?.isAdmin
			? {
					key: 'system',
					title: 'System',
					to: '/settings/system',
					icon: <Icon name="wrench" size={iconSize} />,
				}
			: null,
	].filter(Boolean)
}

interface SettingsLayoutProps {
	children: React.ReactNode
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
	)
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
})
export type SettingsHeaderHandle = z.infer<typeof SettingsHeaderHandle>

const SettingsHeaderHandleMatch = z.object({
	handle: SettingsHeaderHandle,
})

export default function SettingsPage() {
	const matches = useMatches()
	const header = matches
		.map(m => {
			const result = SettingsHeaderHandleMatch.safeParse(m)
			if (!result.success || !result.data.handle.settingHeader) return null
			const headerData = result.data.handle.settingHeader({ match: m })
			return (
				<div key={m.id}>
					<h3 className="text-lg font-medium">{headerData.title}</h3>
					<p className="text-sm text-muted-foreground">
						{headerData.description}
					</p>
				</div>
			)
		})
		.filter(Boolean)

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
	)
}
