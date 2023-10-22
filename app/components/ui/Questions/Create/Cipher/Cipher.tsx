import { type ChangeEvent } from 'react';
import { type QuestionData, CipherType } from '../../types.ts';

export default function Cipher({
  questionData,
  handleUpdate,
}: {
  questionData: QuestionData<'CIPHER'>;
  handleUpdate: (data: QuestionData<'CIPHER'>) => void;
}) {
  const handleTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.currentTarget.value as CipherType;
    handleUpdate({
      ...questionData,
      type: value,
    });
  };

  return (
    <>
      <div>
        <select
          className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
          value={questionData.type || CipherType.PIGPEN}
          onChange={handleTypeChange}
        >
          <option value="PIGPEN">Pig Pen Cipher</option>
          <option value="SHIFT">Shift Cipher</option>
        </select>
      </div>
      {questionData.type === CipherType.SHIFT && (
        <div>
          <label htmlFor="shiftValue">
            Shift Value:
            <input
              type="number"
              value={questionData.shiftValue || 0}
              name="shiftValue"
            />
          </label>
        </div>
      )}
    </>
  );
}
