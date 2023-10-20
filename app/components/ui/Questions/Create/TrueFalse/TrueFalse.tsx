import { useEffect } from "react";
import type { QuestionData } from "../../types";

/**
 * Create a True or False question component
 */
const TrueFalse = ({
  questionData,
  handleUpdate,
}: {
  questionData: QuestionData<"TRUEFALSE">;
  handleUpdate: (data: QuestionData<"TRUEFALSE">) => void;
}) => {
  // Set default values for the first render only
  const setDefaultValues = () => {
    if (typeof questionData.answer !== "boolean") {
      handleUpdate({ answer: true });
    }
  };

  useEffect(setDefaultValues, [handleUpdate, questionData]);

  return (
    <div className="true-false">
      <div className="answer">
        <label htmlFor="answer" className="flex w-full flex-col gap-1">
          <span>Answer: </span>
          <select
            name="answer"
            id="answer"
            value={questionData.answer ? "true" : "false"}
            onChange={(e) =>
              handleUpdate({
                ...questionData,
                answer: e.target.value === "true",
              })
            }
            className="flex-1 rounded-md border-2 border-blue-500 px-3 py-1 text-lg leading-loose"
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </label>
      </div>
    </div>
  );
};

export default TrueFalse;
