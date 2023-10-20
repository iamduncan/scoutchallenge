import type { QuestionData } from "../../types.ts";

const Cipher = ({
  questionData,
  handleUpdate,
}: {
  questionData: QuestionData<"CIPHER">;
  handleUpdate: (data: QuestionData<"CIPHER">) => void;
}) => {
  return <div className="cipher">Cipher Component</div>;
};

export default Cipher;
