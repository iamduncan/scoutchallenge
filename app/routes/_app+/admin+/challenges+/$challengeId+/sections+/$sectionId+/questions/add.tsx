import { useRef, useState } from "react";
import { type Prisma, QuestionType } from "@prisma/client";
import { Form, Link, useActionData } from "@remix-run/react";
import type { EditorState, LexicalEditor } from "lexical";
import Editor from "#app/components/ui/Editor/Editor.tsx";
import { type ActionFunctionArgs, redirect, json } from "@remix-run/node";
import { addQuestion } from "#app/models/challenge.server.ts";
import { CreateMultipleChoice, CreateTrueFalse } from "#app/components/ui/index.ts";

export default function NewQuestionPage() {
  const [ description, setDescription ] = useState<string>();
  const [ questionType, setQuestionType ] = useState<QuestionType>(
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
  const [ questionData, setQuestionData ] = useState<{
    question?: any;
    answer?: any;
  }>();

  const actionData = useActionData<ActionData>();

  return (
    <>
      <div className="flex h-12 w-full items-center justify-between border-b border-gray-400 px-4">
        <h2 className="text-xl font-bold">New Question</h2>
        <Link to="../../">X</Link>
      </div>
      <div className="flex max-h-[calc(95vh_-_3rem)] w-full flex-col gap-8 overflow-x-auto p-4">
        <Form method="post">
          <div>
            <label htmlFor="name" className="flex w-full flex-col gap-1">
              <span>Title: </span>
              {actionData?.errors?.title && (
                <span className="text-red-500">{actionData.errors.title}</span>
              )}
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
            <label htmlFor="description" className="flex w-full flex-col gap-1">
              <span>Description: </span>
              {actionData?.errors?.description && (
                <span className="block text-red-500">
                  {actionData.errors.description}
                </span>
              )}
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
                onChange={(e) => {
                  setQuestionType(e.target.value as QuestionType);
                }}
                className="flex-1 rounded-md border-2 border-blue-500 px-3 py-1 text-lg leading-loose"
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
            <QuestionTypeContent
              questionType={questionType}
              questionData={questionData}
              handleUpdate={setQuestionData}
            />
            <input
              type="hidden"
              name="question_data"
              value={JSON.stringify(questionData)}
            />
            <input type="hidden" name="question_type" value={questionType} />
          </div>

          <div>
            <pre>{JSON.stringify(questionData, null, 2)}</pre>
          </div>

          <div className="text-right">
            <button
              type="submit"
              className="rounded bg-blue-500  px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
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

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const challengeSectionId = params.sectionId;
  const challengeId = params.challengeId;
  if (!challengeSectionId) {
    throw new Error("challengeSectionId is required");
  }
  const formData = await request.formData();
  const title = formData.get("title");
  const description = formData.get("description");
  const type = formData.get("question_type") as QuestionType;
  const questionAnswerData = formData.get("question_data");
  const errors: ActionData[ "errors" ] = {};

  if (typeof title !== "string" || title.length === 0) {
    errors.title = "Title is required";
  }
  if (typeof description !== "string" || description.length === 0) {
    errors.description = "Description is required";
  }
  if (Object.keys(errors).length > 0) {
    return badRequest({
      errors,
    });
  }

  const questionData = {
    title: title as string,
    description: description as string,
    hint: "",
    type,
    data: JSON.parse(questionAnswerData as string) as any,
    order: 0,
  };
  const question = await addQuestion(challengeSectionId, questionData);

  if (!question) {
    return badRequest({
      formError: "Error adding question",
    });
  }
  return redirect(`/admin/challenges/${challengeId}`);
};

const QuestionTypeContent = ({
  questionType,
  handleUpdate,
  questionData,
}: {
  questionType: QuestionType;
  questionData: any;
  handleUpdate: (data: { question?: any; answer?: any }) => void;
}) => {
  switch (questionType) {
    case QuestionType.MULTIPLECHOICE:
      return (
        <CreateMultipleChoice
          questionData={questionData}
          handleUpdate={handleUpdate}
        />
      );
    case QuestionType.TRUEFALSE:
      return (
        <CreateTrueFalse
          questionData={questionData}
          handleUpdate={handleUpdate}
        />
      );
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
