import type { QuestionData } from "../../types";

const MultipleChoice = ({
  questionData,
  name,
  handleUpdate,
}: {
  questionData: QuestionData<"MULTIPLECHOICE">;
  name: string;
  handleUpdate: (data: QuestionData<"MULTIPLECHOICE">) => void;
}) => {
  return (
    <>
      <div className="my-2 flex flex-col gap-2">
        {questionData.question.map((option) => (
          <label
            key={option.id}
            htmlFor={`${name}-${option.id}`}
            className="flex items-center gap-2"
          >
            <input
              type="radio"
              name={name}
              value={option.id}
              id={`${name}-${option.id}`}
            />
            {option.option}
          </label>
        ))}
      </div>
    </>
  );
};

export default MultipleChoice;
