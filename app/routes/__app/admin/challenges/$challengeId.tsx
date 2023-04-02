import { ArrowLeftIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Form, Link, Outlet, useLoaderData } from "@remix-run/react";
import type { ActionFunction, LoaderArgs } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import { useState } from "react";
import { SectionOverview } from "~/components/ui";
import {
  addSectionToChallenge,
  deleteChallenge,
  getChallenge,
} from "~/models/challenge.server";
import { getSectionListItems } from "~/models/section.server";
import { getUser } from "~/session.server";

export const loader = async ({ request, params }: LoaderArgs) => {
  const challengeId = params.challengeId;
  const user = await getUser(request);
  if (!challengeId) {
    return redirect("/admin/challenges");
  }
  const [challenge, sections] = await Promise.all([
    getChallenge({ id: challengeId, groups: user?.groups }),
    getSectionListItems({ groupId: user?.groups[0]?.id }),
  ]);
  return json({ challenge, sections });
};

export default function ViewChallengePage() {
  const { challenge, sections } = useLoaderData<typeof loader>();
  const [confirmDelete, setConfirmDelete] = useState(false);
  return (
    <div>
      <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
        <div className="text-xl font-bold">{challenge?.name}</div>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="flex">
            <Link
              to={`/challenges/${challenge.id}`}
              className="mr-4 rounded border border-blue-500 py-1 px-3 text-sm font-semibold"
            >
              Preview
            </Link>
            <strong className="relative mr-4 inline-flex items-center rounded border border-gray-600 px-2.5 py-1.5 text-sm font-medium">
              <span className="text-gray-700"> Status: </span>

              <span className="ml-1 capitalize text-green-700">
                {challenge.status.toLowerCase()}
              </span>
            </strong>
          </div>
          <div className="flex">
            {challenge?.openDate && (
              <>
                <div className="flex flex-col text-center">
                  <span className="text-sm font-bold">from</span>
                  <span>
                    {new Date(challenge.openDate).toLocaleDateString("en-GB")}
                  </span>
                </div>
                <span className="px-2"> &rarr; </span>
              </>
            )}
            {challenge?.closeDate && (
              <div className="flex flex-col text-center">
                <span className="text-sm font-bold">to</span>
                <span>
                  {new Date(challenge.closeDate).toLocaleDateString("en-GB")}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <Form method="post" className="flex w-full flex-col gap-8">
        <div>
          <label htmlFor="section" className="flex w-full flex-col gap-1">
            <span>Allow Section to access Challenge</span>
            <select
              name="section"
              id="section"
              defaultValue=""
              className="flex-1 rounded-md border-2 border-slate-700 px-3 text-lg leading-loose focus:border-blue-500 active:border-blue-500"
            >
              <option value="">Select Section</option>
              {sections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Add
          </button>
        </div>
      </Form>
      <div dangerouslySetInnerHTML={{ __html: challenge.introductionHtml }} />
      <div className="flex flex-col gap-3 p-4">
        {challenge.challengeSections &&
          challenge.challengeSections.map((section) => (
            <SectionOverview
              key={section.id}
              title={section.title}
              description={section.descriptionHtml}
              questions={section.questions}
              challengeId={challenge.id}
              sectionId={section.id}
              admin
            />
          ))}
      </div>
      <div className="flex gap-2">
        <Link
          to=".."
          className="mr-1 mb-1 flex items-center gap-2 px-3 py-1 text-xs font-bold uppercase text-blue-500 lg:hidden"
          type="button"
        >
          <ArrowLeftIcon className="h-6 w-6" /> Back
        </Link>
        <Link
          to="./sections/add"
          className="rounded bg-green-500  py-2 px-4 text-white hover:bg-green-600 focus:bg-green-400"
        >
          Add Section
        </Link>
        <Link
          to={`./edit`}
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Edit
        </Link>
        <Form method="delete">
          <button
            type="submit"
            onClick={(e) => {
              if (!confirmDelete) {
                e.preventDefault();
                setConfirmDelete(true);
              }
            }}
            className="flex items-center rounded bg-red-500  py-2 px-4 text-white hover:bg-red-600 focus:bg-red-400"
          >
            <TrashIcon className="mr-2 h-5 w-5" />{" "}
            {confirmDelete ? "Confirm" : "Delete"}
          </button>
        </Form>
      </div>
      <Outlet />
    </div>
  );
}

export const action: ActionFunction = async ({ request, params }) => {
  const challengeId = params.challengeId;
  const formData = await request.formData();
  const sectionId = formData.get("section");
  if (request.method === "DELETE") {
    await deleteChallenge({ id: challengeId as string });
    return redirect(`/admin/challenges`);
  }

  if (typeof sectionId !== "string" || !challengeId) {
    return {};
  }

  const challenge = await addSectionToChallenge(challengeId, sectionId);

  return { challenge };
};

export function CatchBoundary() {
  return (
    <div>
      <h2>We couldn't find that challenge!</h2>
      <Link to={'/admin/challenges/new'} className='btn btn-primary'>
        Create a new challenge
      </Link>
    </div>
  );
}
