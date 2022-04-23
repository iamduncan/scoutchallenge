import { Form, useActionData, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import * as React from "react";
import { getGroupListItems } from "~/models/group.server";
import { useUser } from "~/utils";

type LoaderData = {
  groups: { id: string; name: string }[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const groups = await getGroupListItems();
  return json<LoaderData>({ groups });
};

type ActionData = {
  errors?: {
    name?: string;
    body?: string;
  };
};

export default function NewSectionPage() {
  const user = useUser();

  const { groups } = useLoaderData<LoaderData>();

  const actionData = useActionData() as ActionData;
  const nameRef = React.useRef<HTMLInputElement>(null);
  const bodyRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.name) {
      nameRef.current?.focus();
    } else if (actionData?.errors?.body) {
      bodyRef.current?.focus();
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
              className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            >
              <option value="">None</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </label>
          {actionData?.errors?.name && (
            <div className="pt-1 text-red-700" id="name-error">
              {actionData.errors.name}
            </div>
          )}
        </div>
      )}

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Save
        </button>
      </div>
    </Form>
  );
}
