import type { Prisma } from "@prisma/client";
import { Form, Link } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import type { EditorState, LexicalEditor } from "lexical";
import { useRef, useState } from "react";
import Editor from "#app/components/ui/Editor/Editor.tsx";
import { createChallengeSection } from "#app/models/challenge.server.ts";

const AddChallengeSection = () => {
  const titleRef = useRef<HTMLInputElement>(null);
  const [ description, setDescription ] = useState<string>();

  function onChange(editorState: EditorState, editor: LexicalEditor) {
    editor.update(() => {
      const editorState = editor.getEditorState();
      const jsonString = JSON.stringify(editorState);
      setDescription(jsonString);
    });
  }
  return (
    <div className="fixed inset-0 z-50 block h-full w-full overflow-y-auto bg-gray-600 bg-opacity-50">
      <div className="flex h-full w-full items-center justify-center">
        <div className="mx-auto w-11/12 rounded-md border bg-white shadow-lg md:w-10/12">
          <div className="flex h-12 w-full items-center justify-between border-b border-gray-400">
            <div></div>
            <h2 className="text-xl font-bold">
              Add a Section to this Challenge
            </h2>
            <Link to="../" className="pr-6">
              X
            </Link>
          </div>
          <Form method="post" className="flex w-full flex-col gap-8 p-4">
            <div>
              <label htmlFor="name" className="flex w-full flex-col gap-1">
                <span>Title: </span>
                <input
                  ref={titleRef}
                  type="text"
                  name="title"
                  id="title"
                  className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
                />
              </label>
            </div>

            <div>
              <label
                htmlFor="description"
                className="flex w-full flex-col gap-1"
              >
                <span>Description: </span>
                <Editor onChange={onChange} />
                <input
                  type="hidden"
                  name="description"
                  defaultValue={description}
                />
              </label>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="submit"
                className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
              >
                Save
              </button>
              <Link
                to="../"
                className="rounded bg-red-500 py-2 px-4 text-white hover:bg-red-600 focus:bg-red-400"
              >
                Cancel
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AddChallengeSection;

type ActionData = {
  errors?: {
    title?: string;
    description?: string;
  };
  formError?: string;
  fields?: Prisma.ChallengeSectionCreateInput;
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request, params }) => {
  const challengeId = params.challengeId;
  if (!challengeId) {
    return json({ status: 404, message: "Challenge not found" });
  }

  const formData = await request.formData();
  const title = formData.get("title");
  const description = formData.get("description");

  if (typeof title !== "string" || title.length === 0) {
    return badRequest({
      errors: { title: "Title is required" },
    });
  }
  if (typeof description !== "string" || description.length === 0) {
    return badRequest({
      errors: { description: "Description is required" },
    });
  }

  const fields: Prisma.ChallengeSectionCreateWithoutChallengeInput = {
    title,
    description,
    order: 0,
  };

  const challengeSection = await createChallengeSection(challengeId, fields);
  if (challengeSection) {
    return redirect(`/admin/challenges/${challengeId}`);
  }

  return {
    title,
    description,
  };
};
