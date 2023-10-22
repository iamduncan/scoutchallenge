import { Form, Link, useActionData, useLoaderData } from '@remix-run/react';
import {
  type ActionFunction,
  type LoaderFunctionArgs,
  redirect,
  json,
} from '@remix-run/server-runtime';
import * as React from 'react';
import { getGroupListItems } from '#app/models/group.server.ts';
import { createSection } from '#app/models/section.server.ts';
import { getUserById } from '#app/models/user.server.ts';
import { getUserId } from '#app/utils/auth.server.ts';
import { useUser } from '#app/utils/user.ts';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const groups = await getGroupListItems();
  return json({ groups });
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
  const name = formData.get('name');
  const group = formData.get('group');
  const userId = await getUserId(request);
  if (typeof name !== 'string') {
    return badRequest({ formError: 'Form not submitted correctly' });
  }

  if (!userId) {
    return badRequest({
      formError: 'You must be logged in to create a section',
    });
  }

  const errors = {
    name: validateName(name),
    group: group === '' ? 'You must select a group' : undefined,
  };
  const user = await getUserById(userId);
  const groupId = group !== null ? (group as string) : user?.groups[0]?.id;
  const fields = { name, group: groupId };
  if (Object.values(errors).some(Boolean)) {
    return badRequest({ errors, fields });
  }
  const section = await createSection({
    name,
    group: groupId,
    userId,
  });

  return redirect(`/admin/sections/${section.id}`);
};

export default function NewSectionPage() {
  const user = useUser();

  const { groups } = useLoaderData<typeof loader>();

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
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        width: '100%',
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
              actionData?.errors?.name ? 'name-error' : undefined
            }
          />
        </label>
        {actionData?.errors?.name && (
          <div className="pt-1 text-red-700" id="name-error">
            {actionData.errors.name}
          </div>
        )}
      </div>

      {user?.roles.find((role) => role.name === 'ADMIN') && (
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
          className="mb-1 mr-1 rounded bg-blue-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-blue-600"
        >
          Save
        </button>
        <Link
          to=".."
          className="mb-1 ml-2 mr-1 rounded bg-red-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-red-600"
        >
          Cancel
        </Link>
      </div>
    </Form>
  );
}
