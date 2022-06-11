import {
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/outline";
import { useState } from "react";

type SectionOverviewProps = {
  title: string;
  questions: {
    id: string;
    title: string;
    userStatus: "complete" | "started" | "needsAttention" | "notStarted";
    order: number;
  }[];
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
  const { title, questions } = props;

  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 bg-white">
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex w-full cursor-pointer items-center justify-between px-3 py-2"
      >
        <h1 className="rounded-lg bg-gray-50/60 text-center text-2xl font-semibold text-gray-800 md:text-3xl">
          {title}
        </h1>
        {expanded ? (
          <ChevronUpIcon className="h-8 w-8 text-gray-600" />
        ) : (
          <ChevronDownIcon className="h-8 w-8 text-gray-600" />
        )}
      </div>
      <ul className={`${expanded ? "block" : "hidden"} w-full`}>
        {questions.map((question) => (
          <li
            className="flex w-full items-center justify-between border-t"
            key={question.id}
          >
            <h3 className="rounded-lg bg-gray-50/60 py-2 pl-3 text-center text-lg font-normal text-gray-800 md:text-2xl">
              {question.title}
            </h3>
            <div className="flex flex-col items-center justify-between pr-3">
              <CheckCircleIcon
                className={`${getStatusClass(question.userStatus)} h-6 w-6`}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SectionOverview;
