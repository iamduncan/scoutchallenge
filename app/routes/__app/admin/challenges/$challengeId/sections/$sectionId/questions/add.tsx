import type { Prisma } from "@prisma/client";
import { QuestionType } from "@prisma/client";
import { Form, Link } from "@remix-run/react";
import { useRef, useState } from "react";
import Editor from "~/components/ui/Editor/Editor";
import type { EditorState, LexicalEditor } from "lexical";
import type { ActionFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { addQuestion } from "~/models/challenge.server";

export default function NewQuestionPage() {
  const [description, setDescription] = useState<string>();
  const [questionType, setQuestionType] = useState<QuestionType>(
    QuestionType.MULTIPLECHOICE
  );
  function onChange(editorState: EditorState, editor: LexicalEditor) {
    editor.update(() => {
      const editorState = editor.getEditorState();
      const jsonString = JSON.stringify(editorState);
      setDescription(jsonString);
    });
  }

  const titleRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <div className="flex h-12 w-full items-center justify-between border-b border-gray-400 px-4">
        <h2 className="text-xl font-bold">New Question</h2>
        <Link to="../../">X</Link>
      </div>
      <div className="flex max-h-[calc(95vh_-_3rem)] w-full flex-col gap-8 overflow-x-auto p-4">
        <div>New Question Form</div>
        <Form method="post">
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
            <label htmlFor="description">
              <span>Description</span>
              <Editor onChange={onChange} />
              <input
                type="hidden"
                name="description"
                defaultValue={description}
              />
            </label>
          </div>

          <div>
            <label
              htmlFor="questionType"
              className="flex w-full flex-col gap-1"
            >
              <span>Question Type</span>
              <select
                name="questionType"
                defaultValue={questionType}
                onChange={(e) =>
                  setQuestionType(e.target.value as QuestionType)
                }
                className="flex-1 rounded-md border-2 border-slate-700 px-2 text-lg leading-loose focus:border-blue-500 active:border-blue-500"
              >
                <option value={QuestionType.MULTIPLECHOICE}>
                  Multiple Choice
                </option>
                <option value={QuestionType.TRUEFALSE}>True/False</option>
                <option value={QuestionType.TEXT}>Short Answer</option>
                <option value={QuestionType.FILLINTHEBLANK}>
                  Fill in the blank
                </option>
                <option value={QuestionType.IMAGEUPLOAD}>Image Upload</option>
                <option value={QuestionType.VIDEOUPLOAD}>Video Upload</option>
                <option value={QuestionType.FILEUPLOAD}>File Upload</option>
                <option value={QuestionType.CIPHER}>Cipher</option>
              </select>
            </label>
          </div>

          <div>
            <QuestionTypeContent questionType={questionType} />
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
    </>
  );
}

type ActionData = {
  errors?: {
    title?: string;
    description?: string;
  };
  formError?: string;
  fields?: Prisma.QuestionCreateWithoutChallengeSectionInput;
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request, params }) => {
  const challengeSectionId = params.sectionId;
  const challengeId = params.challengeId;
  if (!challengeSectionId) {
    throw new Error("challengeSectionId is required");
  }
  const formData = await request.formData();
  const title = formData.get("title");
  const description = formData.get("description");
  const type = formData.get("questionType") as QuestionType;

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

  const question = await addQuestion(challengeSectionId, {
    title,
    description,
    hint: "",
    type,
    order: 0,
  });

  if (!question) {
    return badRequest({
      formError: "Error adding question",
    });
  }
  return redirect(`/admin/challenges/${challengeId}`);
};

const QuestionTypeContent = ({
  questionType,
}: {
  questionType: QuestionType;
}) => {
  switch (questionType) {
    case QuestionType.MULTIPLECHOICE:
      return <MultipleChoice />;
    case QuestionType.TRUEFALSE:
      return <TrueFalse />;
    case QuestionType.TEXT:
      return <ShortAnswer />;
    case QuestionType.FILLINTHEBLANK:
      return <FillInTheBlank />;
    case QuestionType.IMAGEUPLOAD:
      return <ImageUpload />;
    case QuestionType.VIDEOUPLOAD:
      return <VideoUpload />;
    case QuestionType.FILEUPLOAD:
      return <FileUpload />;
    case QuestionType.CIPHER:
      return <Cipher />;
    default:
      return <>Question title</>;
  }
};

const MultipleChoice = () => {
  const questionData = {};
  return (
    <>
      <p>Question title</p>
      <p>Multiple Choice</p>
    </>
  );
};

const TrueFalse = () => {
  return (
    <>
      <p>Question title</p>
      <p>True/False</p>
    </>
  );
};

const ShortAnswer = () => {
  return (
    <>
      <p>Question title</p>
      <p>Short Answer</p>
    </>
  );
};

const FillInTheBlank = () => {
  return (
    <>
      <p>Question title</p>
      <p>Fill in the blank</p>
    </>
  );
};

const ImageUpload = () => {
  return (
    <>
      <p>Question title</p>
      <p>Image Upload</p>
    </>
  );
};

const VideoUpload = () => {
  return (
    <>
      <p>Question title</p>
      <p>Video Upload</p>
    </>
  );
};

const FileUpload = () => {
  return (
    <>
      <p>Question title</p>
      <p>File Upload</p>
    </>
  );
};

const Cipher = () => {
  return (
    <>
      <p>Question title</p>
      <p>Cipher</p>
    </>
  );
};
