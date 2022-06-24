import { Form, Link } from "@remix-run/react";
import type { EditorState, LexicalEditor } from "lexical";
import { useRef, useState } from "react";
import Editor from "~/components/ui/Editor/Editor";

const AddChallengeSection = () => {
  const titleRef = useRef<HTMLInputElement>(null);
  const [description, setDescription] = useState<string>();

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
        <div className="mx-auto w-10/12 rounded-md border bg-white shadow-lg">
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
                <span>Name: </span>
                <input
                  ref={titleRef}
                  type="text"
                  name="name"
                  id="name"
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

            <div className="text-right">
              <button
                type="submit"
                className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
              >
                Save
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AddChallengeSection;
