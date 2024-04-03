import { json, type LoaderFunctionArgs } from "@remix-run/node"
import { NavLink, Outlet, useLoaderData } from "@remix-run/react"
import { Icon } from "#app/components/ui/icon"
import { prisma } from "#app/utils/db.server"
import { cn } from "#app/utils/misc"
import { requireUserWithRole } from "#app/utils/permissions.server"

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserWithRole(request, 'admin')

  const groups = await prisma.group.findMany({
    select: {
      id: true,
      name: true,
      users: { select: { id: true } },
    },
  })
  
  return json({ groups })
}

export default function Groups() {
  const data = useLoaderData<typeof loader>()
  const navLinkDefaultClassName =
		'line-clamp-2 block rounded-l-full py-2 pl-8 pr-6 text-base lg:text-xl'
  return (
    <main className="container flex h-full min-h-[400px] px-0 pb-12 md:px-8">
			<div className="grid w-full grid-cols-4 bg-muted pl-2 md:container md:rounded-3xl md:pr-0">
				<div className="relative col-span-1">
					<div className="absolute inset-0 flex flex-col">
						<ul className="overflow-y-auto overflow-x-hidden pb-12">
              <NavLink
										to="new"
										className={({ isActive }) =>
											cn(navLinkDefaultClassName, isActive && 'bg-accent')
										}
									>
										<Icon name="plus">New Group</Icon>
									</NavLink>
							{data.groups.map(group => (
								<li key={group.id} className="p-1 pr-0">
									<NavLink
										to={group.id}
										preventScrollReset
										prefetch="intent"
										className={({ isActive }) =>
											cn(navLinkDefaultClassName, isActive && 'bg-accent')
										}
									>
										{group.name}
									</NavLink>
								</li>
							))}
						</ul>
					</div>
				</div>
				<div className="relative col-span-3 bg-accent md:rounded-r-3xl">
					<Outlet />
				</div>
			</div>
		</main>
  )
}