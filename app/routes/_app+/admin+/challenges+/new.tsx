import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import { useRef, useState } from "react";

import type { Prisma, User } from "@prisma/client";
import { ChallengeType } from "@prisma/client";
import { ChallengeStatus } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { EditorState, LexicalEditor } from "lexical";
import { createChallenge } from "#app/models/challenge.server.ts";
import Editor from "#app/components/ui/Editor/Editor.tsx";
import { getGroupListItems } from "#app/models/group.server.ts";
import { requireUserId } from '#app/utils/auth.server.ts';
import { getUserById } from '#app/models/user.server.ts';
import { useUser } from '#app/utils/user.ts';

type LoaderData = {
  groups: { id: string; name: string }[];
};

export const loader: LoaderFunction = async () => {
  const groups = await getGroupListItems();
  return json<LoaderData>({ groups });
};

function validateName(content: string) {
  if (content.length < 5) {
    return `That title is too short`;
  }
}

type ActionData = {
  errors?: {
    name?: string;
    group?: string;
  };
  formError?: string;
  fields?: Prisma.ChallengeCreateInput;
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const user = userId ? await getUserById(userId) : null;
  if (!user) {
    return badRequest({
      formError: "You must be logged in to create a challenge",
    });
  }
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const openDate = formData.get("openDate") as string | null;
  const closeDate = formData.get("closeDate") as string | null;
  const introduction = formData.get("introduction") as string | null;
  const type = formData.get("type") as ChallengeType | null;
  const status = formData.get("status") as ChallengeStatus;
  let group = formData.get("group") as string | null;

  if (!group && user.roles.find(
    (role) => role.name === "ADMIN"
  )) {
    return badRequest({
      formError: "If you are an admin, you must select a group"
    });
  }

  const errors = {
    name: validateName(name),
  };

  if (group === null) {
    group = user.groups[ 0 ].id;
  }

  const fields: Prisma.ChallengeCreateInput = {
    name,
    openDate:
      typeof openDate === "string" && openDate !== "" ? openDate : undefined,
    closeDate:
      typeof closeDate === "string" && closeDate !== "" ? closeDate : undefined,
    introduction: introduction ?? null,
    type: type ?? "STANDARD",
    status: status || "OPEN",
    group: { connect: { id: group } },
    createdBy: {
      connect: {
        id: user.id,
      },
    },
    updatedBy: {
      connect: {
        id: user.id,
      },
    },
  };
  if (Object.values(errors).some(Boolean)) {
    return badRequest({ errors, fields });
  }
  const challenge = await createChallenge(fields);
  return redirect(`/admin/challenges/${challenge.id}`);
};

// When the editor changes, you can get notified via the
// LexicalOnChangePlugin!

export default function NewChallenge() {
  const user = useUser();
  const { groups } = useLoaderData<LoaderData>();

  const nameRef = useRef<HTMLInputElement>(null);
  const actionData = useActionData<ActionData>();
  const [ introduction, setIntroduction ] = useState<string>();
  function onChange(editorState: EditorState, editor: LexicalEditor) {
    editor.update(() => {
      const editorState = editor.getEditorState();
      const jsonString = JSON.stringify(editorState);
      setIntroduction(jsonString);
    });
  }

  return (
    <Form method="post" className="flex w-full flex-col gap-8">
      {actionData?.formError && (
        <div className="text-sm font-bold text-red-600">
          {actionData.formError}
        </div>
      )}
      <div>
        <label htmlFor="name" className="flex w-full flex-col gap-1">
          <span>Name: </span>
          <input
            ref={nameRef}
            type="text"
            name="name"
            id="name"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
          />
        </label>
      </div>

      <div>
        <label htmlFor="openDate" className="flex w-full flex-col gap-1">
          <span>Open Date: </span>
          <input
            type="date"
            name="openDate"
            id="openDate"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
          />
        </label>
      </div>

      <div>
        <label htmlFor="closeDate" className="flex w-full flex-col gap-1">
          <span>Close Date: </span>
          <input
            type="date"
            name="closeDate"
            id="closeDate"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
          />
        </label>
      </div>

      <div>
        <label htmlFor="introduction" className="flex w-full flex-col gap-1">
          <span>Introduction: </span>
          <Editor onChange={onChange} />
          <input
            type="hidden"
            name="introduction"
            defaultValue={introduction}
          />
        </label>
      </div>

      <div>
        <label htmlFor="type" className="flex w-full flex-col gap-1">
          <span>Type: </span>
          <select
            name="type"
            id="type"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
          >
            <option value={ChallengeType.STANDARD}>Standard</option>
            <option value={ChallengeType.CONTEST}>Contest</option>
            <option value={ChallengeType.LIVE}>Live</option>
            <option value={ChallengeType.TEAM}>Team</option>
          </select>
        </label>
      </div>

      <div>
        <label htmlFor="status" className="flex w-full flex-col gap-1">
          <span>Status: </span>
          <select
            name="status"
            id="status"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 py-1 text-lg leading-loose"
          >
            <option value={ChallengeStatus.DRAFT}>Draft</option>
            <option value={ChallengeStatus.PUBLISHED}>Published</option>
          </select>
        </label>
      </div>

      {user?.roles.find((role) => role.name === "ADMIN") && (
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
