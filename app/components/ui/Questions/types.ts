import type { QuestionType } from "@prisma/client";

type TextQuestion = {
  answer: string;
};

type MultipleChoiceQuestion = {
  question: {
    id: string;
    option: string;
  }[];
  answer: string;
};

type TrueFalseQuestion = {
  question: string;
  answer: boolean;
};

type FillInTheBlankQuestion = {
  answer: string;
};

type ImageUploadQuestion = {
  answer: string;
};

type VideoUploadQuestion = {
  answer: string;
};

type FileUploadQuestion = {
  answer: string;
};

export enum CipherType {
  PIGPEN = "PIGPEN",
  SHIFT = "SHIFT",
}
type CipherQuestion = {
  answer: string;
  type: CipherType;
  shiftValue?: number;
};

export type QuestionData<T extends QuestionType> = T extends "TEXT"
  ? TextQuestion
  : T extends "MULTIPLECHOICE"
  ? MultipleChoiceQuestion
  : T extends "TRUEFALSE"
  ? TrueFalseQuestion
  : T extends "FILLINTHEBLANK"
  ? FillInTheBlankQuestion
  : T extends "IMAGEUPLOAD"
  ? ImageUploadQuestion
  : T extends "VIDEOUPLOAD"
  ? VideoUploadQuestion
  : T extends "FILEUPLOAD"
  ? FileUploadQuestion
  : T extends "CIPHER"
  ? CipherQuestion
  : never;
