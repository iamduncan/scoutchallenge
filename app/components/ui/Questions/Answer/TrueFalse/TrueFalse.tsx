import type { QuestionData } from "../../types.ts";

const TrueFalse = ({
  questionData,
  name,
  handleUpdate,
}: {
  questionData: QuestionData<"TRUEFALSE">;
  name: string;
  handleUpdate: (data: QuestionData<"TRUEFALSE">) => void;
}) => {
  return (
    <>
      <div className="my-2 flex flex-col gap-2">
        <label htmlFor={`${name}-true`} className="flex items-center gap-2">
          <input type="radio" name={name} value="true" id={`${name}-true`} />
          True
        </label>
        <label htmlFor={`${name}-false`} className="flex items-center gap-2">
          <input type="radio" name={name} value="false" id={`${name}-false`} />
          False
        </label>
      </div>
    </>
  );
};

export default TrueFalse;
