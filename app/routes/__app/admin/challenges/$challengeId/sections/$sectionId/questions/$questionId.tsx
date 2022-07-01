import { Link } from "@remix-run/react";

export default function QuestionPage() {
  return (
    <>
      <div className="flex h-12 w-full items-center justify-between border-b border-gray-400 px-4">
        <h2 className="text-xl font-bold">Edit Question</h2>
        <Link to="../../">X</Link>
      </div>
      <div className="flex max-h-[calc(95vh_-_3rem)] w-full flex-col gap-8 overflow-x-auto p-4">
        <div>Edit Question Form</div>
      </div>
    </>
  );
}
