import { NavLink, useLocation } from '@remix-run/react'
import { Fragment, useState } from 'react'
import { cn } from '#app/utils/misc.tsx'
import { useUser, userHasRole } from '#app/utils/user.ts'
import { Icon } from './ui/icon'

export interface SidebarNavItem {
	key: string
	to: string
	title: string
	icon?: React.ReactNode
	children?: SidebarNavItem[]
}

export interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
	items: (props: {
		admin?: {
			isAdmin?: boolean
			isTenantAdmin?: boolean
			isClientAdmin?: boolean
		}
	}) => SidebarNavItem[]
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
	const user = useUser()
	const isAdmin = userHasRole(user, 'admin')
	const isTenantAdmin = userHasRole(user, 'tenant_admin')
	const isClientAdmin = userHasRole(user, 'client_admin')
	const location = useLocation()
	const [openMenu, setOpenMenu] = useState(false)
	return (
		<nav
			className={cn(
				'custom-scrollbar flex h-full grow overflow-y-auto lg:block',
				className,
			)}
			{...props}
		>
			<div className="flex grow flex-col">
				{items({
					admin: {
						isAdmin,
						isTenantAdmin,
						isClientAdmin,
					},
				}).map(item => (
					<Fragment key={item.key}>
						<NavLink
							to={item.to}
							className={({ isActive }) =>
								cn(
									'flex-grow items-center gap-3 border-l-4 border-transparent px-2 py-3 lg:flex',
									{
										'border-slate-600 bg-muted font-semibold text-muted-foreground dark:border-slate-400':
											isActive,
									},
									isActive ? 'flex' : openMenu ? 'flex' : 'hidden',
								)
							}
							onClick={() => setOpenMenu(false)}
						>
							{item.icon} {item.title}
						</NavLink>
						{item.children && location.pathname.includes(item.to)
							? item.children.map(child => (
									<NavLink
										key={child.key}
										to={`${item.to}${child.to}`}
										className={({ isActive }) =>
											cn(
												{
													'border-slate-600 bg-muted font-semibold text-muted-foreground hover:bg-muted dark:border-slate-400':
														isActive,
												},
												'hidden justify-start border-l-4 border-transparent px-2 py-3 !pl-5 hover:bg-transparent hover:underline lg:flex',
											)
										}
									>
										{child.title}
									</NavLink>
								))
							: null}
					</Fragment>
				))}
			</div>
			<div
				className={`flex w-12 justify-center lg:hidden ${
					openMenu ? 'mt-3' : 'items-center'
				}`}
			>
				<Icon
					name="menu"
					className="h-6 w-6"
					onClick={() => setOpenMenu(!openMenu)}
				/>
			</div>
		</nav>
	)
}
