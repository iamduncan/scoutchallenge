import {
	FormProvider,
	getFormProps,
	getInputProps,
	getSelectProps,
	getTextareaProps,
	useForm,
} from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { type Question } from '@prisma/client'
import { type SerializeFrom } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import { useState } from 'react'
import { z } from 'zod'
import { floatingToolbarClassName } from '#app/components/floating-toolbar'
import {
	ErrorList,
	Field,
	SelectField,
	TextareaField,
} from '#app/components/forms'
import { CreateMultipleChoice } from '#app/components/questions/multiplechoice-create'
import { CreateTrueFalse } from '#app/components/questions/truefalse-create'
import { QuestionType } from '#app/components/questions/types'
import { Button } from '#app/components/ui/button'
import { StatusButton } from '#app/components/ui/status-button'
import { useIsPending } from '#app/utils/misc'
import { type action } from './__question-editor.server'

export const QuestionSchema = z.object({
	id: z.string().optional(),
	title: z.string(),
	description: z.string(),
	hint: z.string(),
	type: z.enum(['multiple_choice', 'short_answer', 'code']),
})

export function QuestionEditor({
	question,
}: {
	question: SerializeFrom<
		Pick<Question, 'id' | 'title' | 'description' | 'hint' | 'type'>
	>
}) {
	const [questionType, setQuestionType] = useState<QuestionType>(
		QuestionType.TEXT,
	)
	const [questionData, setQuestionData] = useState<{
		question?: any
		answer?: any
	}>({})

	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const [form, fields] = useForm({
		id: 'question-editor',
		constraint: getZodConstraint(QuestionSchema),
		lastResult: actionData?.result,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: QuestionSchema })
		},
		defaultValue: {
			...question,
		},
		shouldRevalidate: 'onBlur',
	})

	return (
		<div className="mb-20">
			<FormProvider context={form.context}>
				<Form method="POST" {...getFormProps(form)}>
					<button type="submit" className="hidden" />
					{question ? (
						<input type="hidden" name="id" value={question.id} />
					) : null}
					<div className="flex flex-col gap-1">
						<Field
							labelProps={{ children: 'Question Title' }}
							inputProps={{
								...getInputProps(fields.title, { type: 'text' }),
								placeholder: 'What colour is the sky?',
							}}
							errors={fields.title.errors}
						/>

						<TextareaField
							labelProps={{ children: 'Question Description' }}
							textareaProps={{ ...getTextareaProps(fields.description) }}
							errors={fields.description.errors}
						/>

						<SelectField
							labelProps={{ children: 'Question Type' }}
							selectProps={{
								...getSelectProps(fields.type, { value: false }),
								value: questionType,
								onValueChange: value => setQuestionType(value as QuestionType),
							}}
							options={[
								{ value: QuestionType.TEXT, label: 'Text' },
								{ value: QuestionType.TRUEFALSE, label: 'True/False' },
								{
									value: QuestionType.MULTIPLECHOICE,
									label: 'Multiple Choice',
								},
								{ value: QuestionType.CIPHER, label: 'Cipher' },
							]}
						/>

						<div>
							<QuestionTypeContent
								questionType={questionType}
								questionData={questionData}
								handleUpdate={setQuestionData}
							/>
							<input
								type="hidden"
								name="question_data"
								value={JSON.stringify(questionData)}
							/>
						</div>

						<Field
							labelProps={{ children: 'Hint' }}
							inputProps={{ ...getInputProps(fields.hint, { type: 'text' }) }}
							errors={fields.hint.errors}
						/>
					</div>
					<ErrorList id={form.errorId} errors={form.errors} />
				</Form>
				<div className={floatingToolbarClassName}>
					<Button variant="destructive" {...form.reset.getButtonProps()}>
						Reset
					</Button>
					<StatusButton
						form={form.id}
						type="submit"
						disabled={isPending}
						status={isPending ? 'pending' : 'idle'}
					>
						Submit
					</StatusButton>
				</div>
			</FormProvider>
		</div>
	)
}

function QuestionTypeContent({
	questionType,
	handleUpdate,
	questionData,
}: {
	questionType: QuestionType
	questionData: any
	handleUpdate: (data: { question?: any; answer?: any }) => void
}) {
	switch (questionType) {
		case QuestionType.MULTIPLECHOICE:
			return (
				<CreateMultipleChoice
					questionData={questionData}
					handleUpdate={handleUpdate}
				/>
			)
		case QuestionType.TRUEFALSE:
			return (
				<CreateTrueFalse
					questionData={questionData}
					handleUpdate={handleUpdate}
				/>
			)
		case QuestionType.TEXT:
			return <ShortAnswer />
		case QuestionType.FILLINTHEBLANK:
			return <FillInTheBlank />
		case QuestionType.IMAGEUPLOAD:
			return <ImageUpload />
		case QuestionType.VIDEOUPLOAD:
			return <VideoUpload />
		case QuestionType.FILEUPLOAD:
			return <FileUpload />
		case QuestionType.CIPHER:
			return <Cipher />
		default:
			return <>Question title</>
	}
}

const ShortAnswer = () => {
	return (
		<>
			<Field
				labelProps={{ children: 'Answer' }}
				inputProps={{ type: 'text' }}
			/>
		</>
	)
}

const FillInTheBlank = () => {
	return (
		<>
			<p>Question title</p>
			<p>Fill in the blank</p>
		</>
	)
}

const ImageUpload = () => {
	return (
		<>
			<p>Question title</p>
			<p>Image Upload</p>
		</>
	)
}

const VideoUpload = () => {
	return (
		<>
			<p>Question title</p>
			<p>Video Upload</p>
		</>
	)
}

const FileUpload = () => {
	return (
		<>
			<p>Question title</p>
			<p>File Upload</p>
		</>
	)
}

const Cipher = () => {
	return (
		<>
			<p>Question title</p>
			<p>Cipher</p>
		</>
	)
}
