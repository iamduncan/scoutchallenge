import { QuestionType } from "@prisma/client";
import { Form, Link } from "@remix-run/react";
import { useState } from "react";
import Editor from "~/components/ui/Editor/Editor";
import type { EditorState, LexicalEditor } from "lexical";

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
            <label htmlFor="title" className="flex w-full flex-col gap-1">
              <span>Title</span>
              <input type="text" name="title" />
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
                className="flex-1 rounded-md border-2 border-slate-700 px-3 text-lg leading-loose focus:border-blue-500 active:border-blue-500"
              >
                <option value={QuestionType.MULTIPLECHOICE}>
                  Multiple Choice
                </option>
                <option value={QuestionType.TRUEFALSE}>True/False</option>
                <option value={QuestionType.TEXT}>Short Answer</option>
              </select>
            </label>
          </div>

          <div>
            <QuestionTypeContent questionType={questionType} />
          </div>
        </Form>
      </div>
    </>
  );
}

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
