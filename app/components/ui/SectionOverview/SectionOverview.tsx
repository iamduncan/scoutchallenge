import {
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/outline";
import type { Question } from "@prisma/client";
import { Link } from "@remix-run/react";
import { useState } from "react";

type SectionOverviewProps = {
  title: string;
  description?: string;
  questions: (Pick<Question, "id" | "title"> & {
    userStatus?: "complete" | "started" | "needsAttention" | "notStarted";
  })[];
  sectionId: string;
  admin?: boolean;
};

const getStatusClass = (
  status: "complete" | "started" | "needsAttention" | "notStarted"
) => {
  switch (status) {
    case "complete":
      return "text-green-500";
    case "started":
      return "text-orange-500";
    case "needsAttention":
      return "text-red-500";
    case "notStarted":
      return "text-grey-300";
    default:
      return "text-grey-300";
  }
};

const SectionOverview = (props: SectionOverviewProps) => {
  const { title, description, questions, sectionId, admin } = props;

  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 bg-white">
      <div
        onClick={() => setExpanded(!expanded)}
        className={`flex w-full cursor-pointer items-center justify-between bg-gray-50 px-3 py-2 ${
          expanded ? "border-b border-gray-200" : ""
        }`}
      >
        <h1 className="rounded-lg text-xl font-semibold text-gray-800 md:text-3xl">
          {title}
        </h1>
        <div className="flex items-center gap-2">
          {expanded ? (
            <ChevronUpIcon className="h-8 w-8 rounded-full border-2 border-gray-400 text-gray-600" />
          ) : (
            <ChevronDownIcon className="h-8 w-8 rounded-full border-2 border-gray-400 text-gray-600" />
          )}
        </div>
      </div>
      <div className={`${expanded ? "block" : "hidden"} w-full`}>
        <div className="flex items-center px-3">
          <div
            dangerouslySetInnerHTML={{ __html: description || "" }}
            className="flex-grow py-2 text-xl"
          />
          {admin && (
            <Link
              to={`./sections/${sectionId}`}
              className="m-1 rounded border border-sky-500 py-2 px-3"
            >
              Edit Section
            </Link>
          )}
        </div>
        <ul>
          {questions.map((question) => (
            <li
              className="flex w-full items-center justify-between border-t"
              key={question.id}
            >
              <h3 className="rounded-lg bg-gray-50/60 py-2 pl-3 text-center text-lg font-normal text-gray-800 md:text-2xl">
                {question.title}
              </h3>
              {question.userStatus && (
                <div className="flex flex-col items-center justify-between pr-3">
                  <CheckCircleIcon
                    className={`${getStatusClass(question.userStatus)} h-6 w-6`}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SectionOverview;
