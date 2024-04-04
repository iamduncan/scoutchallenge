import { invariantResponse } from "@epic-web/invariant";
import { json, type SerializeFrom, type LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from "#app/components/ui/breadcrumb";
import { type BreadcrumbHandle } from "#app/routes/_app+/challenges";
import { prisma } from "#app/utils/db.server";

const TITLE_LENGTH = 30

export const handle: BreadcrumbHandle = {
	breadcrumb: (match: any, last?: boolean) => {
		const current = match.data as SerializeFrom<typeof loader>
		return (
			<BreadcrumbItem>
        {last ? (
          <BreadcrumbPage title={current.task.title}>
            {current.task.title.length > TITLE_LENGTH ? `${current.task.title.slice(0, TITLE_LENGTH)}...` : current.task.title}
          </BreadcrumbPage>
        ):(
          <BreadcrumbLink asChild>
            <Link to={`/challenges/${current.challengeId}/sections/${current.sectionId}/tasks/${current.task.id}`}  title={current.task.title}>
              {current.task.title.length > TITLE_LENGTH ? `${current.task.title.slice(0, TITLE_LENGTH)}...` : current.task.title}
              </Link>
          </BreadcrumbLink>
        )}
			</BreadcrumbItem>
		)
	},
}

export async function loader({ params }: LoaderFunctionArgs) {
  const task = await prisma.task.findUnique({
    where: {
      id: params.taskId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      hint: true,
      type: true,
      data: true,
    },
  });

  invariantResponse(task, "Task not found");

  return json({
    task,
    challengeId: params.challengeId,
    sectionId: params.sectionId,
  })
}

export default function TaskView() {
  const data = useLoaderData<typeof loader>()
  return (
    <div>
      <h1>
        {data.task.title}
      </h1>

      <pre>{JSON.stringify(data.task, null, 2)}</pre>
    </div>
  )
}