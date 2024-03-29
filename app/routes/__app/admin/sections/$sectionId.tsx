import { ArrowLeftIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { Section } from "@prisma/client";
import { Form, Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { useState } from "react";
import { getSection } from "~/models/section.server";

type LoaderData = {
  section: Section;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const sectionId = params.sectionId;
  if (!sectionId) {
    return {};
  }
  const section = await getSection({ id: sectionId });
  return { section };
};

export default function ViewSectionPage() {
  const { section } = useLoaderData<LoaderData>();
  const [confirmDelete, setConfirmDelete] = useState(false);
  return (
    <div>
      <div>{section?.name}</div>
      <div>
        <pre>{JSON.stringify(section, null, 2)}</pre>
      </div>
      <div className="flex gap-2">
        <Link
          to=".."
          className="mr-1 mb-1 flex items-center gap-2 px-3 py-1 text-xs font-bold uppercase text-blue-500"
          type="button"
        >
          <ArrowLeftIcon className="h-6 w-6" /> Back
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
    </div>
  );
}
