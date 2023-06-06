import { useEffect } from 'react';
import type { QuestionData } from "../../types";

/**
 * Create a True or False question component
 */
const TrueFalse = ({
  questionData,
  handleUpdate,
}: {
  questionData: QuestionData<"TRUEFALSE">;
  handleUpdate: (questionData: QuestionData<"TRUEFALSE">) => void;
}) => {
  const { question, answer } = questionData;
    useEffect(() => {
    handleUpdate({ ...questionData, question: '', answer: true });
  }, [handleUpdate, questionData]);

  return (
    <div className="true-false">
      <div className="question">
        <input
          type="text"
          value={question}
          onChange={(e) =>
            handleUpdate({ ...questionData, question: e.target.value })
          }
          placeholder="Question"
        />
      </div>
      <div className="answer">
        <select
          value={answer ? "true" : "false"}
          onChange={(e) =>
            handleUpdate({ ...questionData, answer: e.target.value === "true" })
          }
        >
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      </div>
    </div>
  );
};

export default TrueFalse;
