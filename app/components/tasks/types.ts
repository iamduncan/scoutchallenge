export enum TaskType {
	TEXT = 'TEXT',
	MULTIPLECHOICE = 'MULTIPLECHOICE',
	TRUEFALSE = 'TRUEFALSE',
	FILLINTHEBLANK = 'FILLINTHEBLANK',
	IMAGEUPLOAD = 'IMAGEUPLOAD',
	VIDEOUPLOAD = 'VIDEOUPLOAD',
	FILEUPLOAD = 'FILEUPLOAD',
	CIPHER = 'CIPHER',
	MULTIPART = 'MULTIPART',
	MULTIENTRY = 'MULTIENTRY',
}

type TextQuestion = {
	answer: string
}

type MultipleChoiceQuestion = {
	question: {
		id: string
		option: string
	}[]
	answer: string
}

type TrueFalseQuestion = {
	answer: boolean
}

type FillInTheBlankQuestion = {
	answer: string
}

type ImageUploadQuestion = {
	answer: string
}

type VideoUploadQuestion = {
	answer: string
}

type FileUploadQuestion = {
	answer: string
}

export enum CipherType {
	PIGPEN = 'PIGPEN',
	SHIFT = 'SHIFT',
}
type CipherQuestion = {
	answer: string
	type: CipherType
	shiftValue?: number
}

type MultiPartQuestion = {
	parts: {
		type: TaskType
		data: TaskData<TaskType>
	}[]
}

type MultiEntryQuestion = {
	entries: {
		type: TaskType
		data: TaskData<TaskType>
	}[]
}

export type TaskData<T extends TaskType> = T extends TaskType.TEXT
	? TextQuestion
	: T extends TaskType.MULTIPLECHOICE
		? MultipleChoiceQuestion
		: T extends TaskType.TRUEFALSE
			? TrueFalseQuestion
			: T extends TaskType.FILLINTHEBLANK
				? FillInTheBlankQuestion
				: T extends TaskType.IMAGEUPLOAD
					? ImageUploadQuestion
					: T extends TaskType.VIDEOUPLOAD
						? VideoUploadQuestion
						: T extends TaskType.FILEUPLOAD
							? FileUploadQuestion
							: T extends TaskType.CIPHER
								? CipherQuestion
								: T extends TaskType.MULTIPART
									? MultiPartQuestion
									: T extends TaskType.MULTIENTRY
										? MultiEntryQuestion
										: never
