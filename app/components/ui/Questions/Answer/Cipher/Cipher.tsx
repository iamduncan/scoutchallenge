import type { QuestionData } from "../../types";

const Cipher = ({
  questionData,
  handleUpdate,
}: {
  questionData: QuestionData;
  handleUpdate: (data: QuestionData) => void;
}) => {
  return <div className="cipher">Cipher Component</div>;
};

export default Cipher;
