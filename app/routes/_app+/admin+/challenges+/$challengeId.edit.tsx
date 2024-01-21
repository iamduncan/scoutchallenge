import { type Prisma, ChallengeStatus } from '@prisma/client';
import { Form, Link, useActionData, useLoaderData } from '@remix-run/react';
import {
  type ActionFunction,
  type LoaderFunctionArgs,
  redirect,
  json,
} from '@remix-run/server-runtime';
import { type EditorState, type LexicalEditor } from 'lexical';
import { useRef, useState } from 'react';
import Editor from '#app/components/ui/Editor/Editor.tsx';
import { getChallenge, updateChallenge } from '#app/models/challenge.server.ts';
import { getUserId } from '#app/utils/auth.server.ts';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const challengeId = params.challengeId;
  if (!challengeId) {
    return redirect('/admin/challenges');
  }
  const challenge = await getChallenge({ id: challengeId });
  return json({ challenge });
};

function validateName(content: string) {
  if (content.length < 5) {
    return `That title is too short`;
  }
}

type ActionData = {
  errors?: {
    name?: string;
  };
  formError?: string;
  fields?: Prisma.ChallengeUpdateInput;
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request, params }) => {
  const challengeId = params.challengeId;
  const userId = await getUserId(request);
  if (!userId || !challengeId) {
    return badRequest({
      formError: 'You must be logged in to update a challenge',
    });
  }
  const formData = await request.formData();
  const name = formData.get('name') as string;
  const openDate = formData.get('openDate') as string | null;
  const closeDate = formData.get('closeDate') as string | null;
  const introduction = formData.get('introduction') as string | null;
  const status = formData.get('status') as ChallengeStatus;

  const errors = {
    name: validateName(name),
  };

  const fields: Prisma.ChallengeUpdateInput = {
    name,
    openDate:
      typeof openDate === 'string' && openDate !== ''
        ? new Date(openDate)
        : undefined,
    closeDate:
      typeof closeDate === 'string' && closeDate !== ''
        ? new Date(closeDate)
        : undefined,
    introduction: introduction ?? null,
    status: status || 'OPEN',
    createdBy: {
      connect: {
        id: userId,
      },
    },
    updatedBy: {
      connect: {
        id: userId,
      },
    },
  };
  if (Object.values(errors).some(Boolean)) {
    return badRequest({ errors, fields });
  }
  const challenge = await updateChallenge(challengeId, fields);
  return redirect(`/admin/challenges/${challenge.id}`);
};

export default function ViewChallengePage() {
  const { challenge } = useLoaderData<typeof loader>();
  const nameRef = useRef<HTMLInputElement>(null);
  const actionData = useActionData<ActionData>();
  const [introduction, setIntroduction] = useState<string>();
  function onChange(editorState: EditorState, editor: LexicalEditor) {
    editor.update(() => {
      const editorState = editor.getEditorState();
      const jsonString = JSON.stringify(editorState);
      setIntroduction(jsonString);
    });
  }

  const openDate =
    typeof challenge?.openDate === 'string'
      ? new Date(challenge?.openDate).toISOString().split('T')[0]
      : undefined;

  const closeDate =
    typeof challenge?.closeDate === 'string'
      ? new Date(challenge?.closeDate).toISOString().split('T')[0]
      : undefined;

  return (
    <div>
      <div className="flex justify-between">
        <div>{challenge?.name}</div>
        <div className="flex items-center">
          {challenge?.openDate && (
            <>
              <div className="flex flex-col text-center">
                <span className="text-sm font-bold">from</span>
                <span>
                  {new Date(challenge.openDate).toLocaleDateString('en-GB')}
                </span>
              </div>
              <span className="px-2"> &rarr; </span>
            </>
          )}
          {challenge?.closeDate && (
            <div className="flex flex-col text-center">
              <span className="text-sm font-bold">to</span>
              <span>
                {new Date(challenge.closeDate).toLocaleDateString('en-GB')}
              </span>
            </div>
          )}
        </div>
      </div>
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
              defaultValue={challenge?.name}
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
              defaultValue={openDate}
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
              defaultValue={closeDate}
              className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            />
          </label>
        </div>

        <div>
          <label htmlFor="introduction" className="flex w-full flex-col gap-1">
            <span>Introduction: </span>
            <Editor
              initialContent={
                challenge.introduction || introduction || undefined
              }
              onChange={onChange}
            />
            <input
              type="hidden"
              name="introduction"
              defaultValue={challenge.introduction || ''}
            />
          </label>
        </div>

        <div>
          <label htmlFor="status" className="flex w-full flex-col gap-1">
            <span>Status: </span>
            <select
              name="status"
              id="status"
              className="flex-1 rounded-md border-2 border-blue-500 px-3 py-1 text-lg leading-loose"
              defaultValue={challenge?.status}
            >
              <option value={ChallengeStatus.DRAFT}>Draft</option>
              <option value={ChallengeStatus.PUBLISHED}>Published</option>
            </select>
          </label>
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="rounded bg-blue-500  px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
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
      <div>
        <pre className="max-w-xl overflow-auto">
          {JSON.stringify(challenge, null, 2)}
        </pre>
      </div>
    </div>
  );
}
