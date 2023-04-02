import { useState } from "react";
import { Button, Input } from "~/components/ui";

type QuestionData = { question: any; answer?: any };

/**
 * Create a Multiple Choice question component
 */
const MultipleChoice = ({
  questionData,
  handleUpdate,
}: {
  questionData: QuestionData;
  handleUpdate: (data: QuestionData) => void;
}) => {
  const [options, setOptions] = useState([
    { id: "1", option: "" },
    { id: "2", option: "" },
  ]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  const handleAddOption = () => {
    const newId = (options[options.length - 1].id + 1).toString();
    setOptions([...options, { id: newId, option: "" }]);
  };

  const handleRemoveOption = (id: number) => {
    const newOptions = options.filter((option) => option.id !== id.toString());
    setOptions(newOptions);
  };

  const handleOptionChange = (id: number, value: string) => {
    const newOptions = options.map((option) => {
      if (option.id === id.toString()) {
        return { ...option, option: value };
      }
      return option;
    });
    setOptions(newOptions);
    handleUpdate({ ...questionData, question: newOptions });
  };

  const handleSelectCorrectAnswer = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const id = e.target.value;
    setCorrectAnswer(id);
    handleUpdate({ ...questionData, answer: id });
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <div key={option.id} className="flex gap-2">
            <Input
              value={option.option}
              onChange={(e) =>
                handleOptionChange(parseInt(option.id), e.target.value)
              }
              placeholder="Enter option"
            />
            <Button onClick={() => handleRemoveOption(parseInt(option.id))}>
              Remove
            </Button>
          </div>
        ))}
      </div>
      {/* select correct answer */}
      <select
        className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
        value={correctAnswer}
        onChange={handleSelectCorrectAnswer}
      >
        <option>Select correct answer</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            Option {option.id} - {option.option}
          </option>
        ))}
      </select>
      <Button onClick={handleAddOption}>Add Option</Button>
    </>
  );
};

export default MultipleChoice;
