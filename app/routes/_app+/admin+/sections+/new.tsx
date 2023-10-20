import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import * as React from "react";
import { getGroupListItems } from "~/models/group.server";
import { createSection } from "~/models/section.server";
import { getUser } from "~/session.server";
import { useUser } from "~/utils";

type LoaderData = {
  groups: { id: string; name: string }[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const groups = await getGroupListItems();
  return json<LoaderData>({ groups });
};

function validateName(content: string) {
  if (content.length < 5) {
    return `That name is too short`;
  }
}

type ActionData = {
  errors?: {
    name?: string;
    group?: string;
  };
  formError?: string;
  fields?: {
    name?: string;
    group?: string;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name");
  const group = formData.get("group");
  const user = await getUser(request);
  if (typeof name !== "string") {
    return badRequest({ formError: "Form not submitted correctly" });
  }

  if (!user) {
    return badRequest({
      formError: "You must be logged in to create a section",
    });
  }

  const errors = {
    name: validateName(name),
    group: group === "" ? "You must select a group" : undefined,
  };
  const groupId = group !== null ? (group as string) : user?.groups[0]?.id;
  const fields = { name, group: groupId };
  if (Object.values(errors).some(Boolean)) {
    return badRequest({ errors, fields });
  }
  const section = await createSection({
    name,
    group: groupId,
    userId: user.id,
  });

  return redirect(`/admin/sections/${section.id}`);
};

export default function NewSectionPage() {
  const user = useUser();

  const { groups } = useLoaderData<LoaderData>();

  const actionData = useActionData() as ActionData;
  const nameRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.name) {
      nameRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Name: </span>
          <input
            ref={nameRef}
            name="name"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.name ? true : undefined}
            aria-errormessage={
              actionData?.errors?.name ? "name-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.name && (
          <div className="pt-1 text-red-700" id="name-error">
            {actionData.errors.name}
          </div>
        )}
      </div>

      {user?.role === "ADMIN" && (
        <div>
          <label className="flex w-full flex-col gap-1">
            <span>Group: </span>
            <select
              name="group"
              id="group"
              className="flex-1 rounded-md border-2 border-blue-500 px-3 py-1 text-lg leading-loose"
            >
              <option value="">None</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </label>
          {actionData?.errors?.group && (
            <div className="pt-1 text-red-700" id="group-error">
              {actionData.errors.group}
            </div>
          )}
        </div>
      )}

      <div className="text-right">
        <button
          type="submit"
          className="mr-1 mb-1 rounded bg-blue-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-blue-600"
        >
          Save
        </button>
        <Link
          to=".."
          className="ml-2 mr-1 mb-1 rounded bg-red-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-red-600"
        >
          Cancel
        </Link>
      </div>
    </Form>
  );
}
