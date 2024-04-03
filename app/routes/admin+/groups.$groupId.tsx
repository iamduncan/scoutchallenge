import { invariantResponse } from "@epic-web/invariant";
import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { floatingToolbarClassName } from "#app/components/floating-toolbar";
import { Button } from "#app/components/ui/button";
import { Icon } from "#app/components/ui/icon";
import { prisma } from "#app/utils/db.server";
import { useOptionalUser, userHasPermission } from "#app/utils/user";
import { DeleteNote } from "../users+/$username_+/notes.$noteId";

export async function loader({ params }: LoaderFunctionArgs) {
  const group = await prisma.group.findUnique({
    where: { id: params.groupId },
    select: {
      id: true,
      name: true,
      description: true,
      users: { select: { id: true, name: true, username: true } },
    },
  })

  invariantResponse(group, 'Not found', { status: 404 })

  return json({ group })
}

export default function NoteRoute() {
	const data = useLoaderData<typeof loader>()
	const user = useOptionalUser()
	const isOwner = data.group.users.some(u => u.id)
	const canDelete = userHasPermission(
		user,
		isOwner ? `delete:note:own` : `delete:note:any`,
	)
	const displayBar = canDelete || isOwner

	return (
		<div className="absolute inset-0 flex flex-col px-10">
			<h2 className="mb-2 pt-12 text-h2 lg:mb-6">{data.group.name}</h2>
			<div className={`${displayBar ? 'pb-24' : 'pb-12'} overflow-y-auto`}>
        <p className="whitespace-break-spaces text-sm md:text-lg">
					{data.group.description}
				</p>
			</div>
      <h3>Users</h3>
      <ul>
        {data.group.users.map(user => (
          <li key={user.id}>
            <Link to={`/users/${user.username}`}>{user.name}</Link>
          </li>
        ))}
      </ul>
			{displayBar ? (
				<div className={floatingToolbarClassName}>
					<div className="grid flex-1 grid-cols-2 justify-end gap-2 min-[525px]:flex md:gap-4">
						{canDelete ? <DeleteNote id={data.group.id} /> : null}
						<Button
							asChild
							className="min-[525px]:max-md:aspect-square min-[525px]:max-md:px-0"
						>
							<Link to="edit">
								<Icon name="pencil-1" className="scale-125 max-md:scale-150">
									<span className="max-md:hidden">Edit</span>
								</Icon>
							</Link>
						</Button>
					</div>
				</div>
			) : null}
		</div>
	)
}
