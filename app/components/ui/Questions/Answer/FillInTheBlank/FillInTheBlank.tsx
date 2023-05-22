import type { QuestionData } from "../../types";

const FillInTheBlank = ({
  questionData,
  handleUpdate,
}: {
  questionData: QuestionData<"FILLINTHEBLANK">;
  handleUpdate: (data: QuestionData<"FILLINTHEBLANK">) => void;
}) => {
  return <div>FillInTheBlank</div>;
};

export default FillInTheBlank;
