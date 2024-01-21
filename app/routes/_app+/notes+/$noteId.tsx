import {
  type ActionFunction,
  type LoaderFunctionArgs,
  json,
  redirect,
} from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';

import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx';
import { type Note, deleteNote, getNote } from '#app/models/note.server.ts';
import { requireUserId } from '#app/utils/auth.server.ts';

type LoaderData = {
  note: Note;
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.noteId, 'noteId not found');

  const note = await getNote({ ownerId: userId, id: params.noteId });
  if (!note) {
    throw new Response('Not Found', { status: 404 });
  }
  return json<LoaderData>({ note });
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.noteId, 'noteId not found');

  await deleteNote({ ownerId: userId, id: params.noteId });

  return redirect('/notes');
};

export default function NoteDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.note.title}</h3>
      <p className="py-6">{data.note.content}</p>
      <hr className="my-4" />
      <Form method="post">
        <button
          type="submit"
          className="rounded bg-blue-500  px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete
        </button>
      </Form>
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <GeneralErrorBoundary
      statusHandlers={{
        404: () => <p>Note not found</p>,
      }}
    />
  );
}
