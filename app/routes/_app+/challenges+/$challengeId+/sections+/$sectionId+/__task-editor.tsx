import {
	FormProvider,
	getFormProps,
	getInputProps,
	getSelectProps,
	getTextareaProps,
	useForm,
} from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { type Task } from '@prisma/client'
import { type SerializeFrom } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import { useState } from 'react'
import { z } from 'zod'
import { floatingToolbarClassName } from '#app/components/floating-toolbar'
import {
	CheckboxField,
	ErrorList,
	Field,
	SelectField,
	TextareaField,
} from '#app/components/forms'
import { CreateMultiPart } from '#app/components/tasks/multipart-create'
import { CreateMultipleChoice } from '#app/components/tasks/multiplechoice-create'
import { CreateTrueFalse } from '#app/components/tasks/truefalse-create'
import { type TaskData, TaskType } from '#app/components/tasks/types'
import { Button } from '#app/components/ui/button'
import { StatusButton } from '#app/components/ui/status-button'
import { useIsPending } from '#app/utils/misc'
import { type action } from './__task-editor.server'

export const TaskSchema = z.object({
	id: z.string().optional(),
	title: z.string(),
	description: z.string(),
	hint: z.string(),
	type: z.nativeEnum(TaskType),
	points: z.number().default(1),
	multiEntry: z.boolean().default(false),
	data: z.string().optional(),
})

export function TaskEditor({
	task,
}: {
	task: SerializeFrom<
		Pick<Task, 'id' | 'title' | 'description' | 'hint' | 'type'>
	>
}) {
	const [taskType, setTaskType] = useState<TaskType>(TaskType.TEXT)
	const [questionData, setQuestionData] = useState<TaskData<TaskType>>()
	const [multiEntry, setMultiEntry] = useState<Boolean>(false)

	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const [form, fields] = useForm({
		id: 'question-editor',
		constraint: getZodConstraint(TaskSchema),
		lastResult: actionData?.result,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: TaskSchema })
		},
		defaultValue: {
			...task,
		},
		shouldRevalidate: 'onBlur',
	})

	return (
		<div className="mb-20">
			<FormProvider context={form.context}>
				<Form method="POST" {...getFormProps(form)}>
					<button type="submit" className="hidden" />
					{task ? <input type="hidden" name="id" value={task.id} /> : null}
					<div className="flex flex-col gap-1">
						<Field
							labelProps={{ children: 'Task Title' }}
							inputProps={{
								...getInputProps(fields.title, { type: 'text' }),
								placeholder: 'What colour is the sky?',
							}}
							errors={fields.title.errors}
						/>

						<TextareaField
							labelProps={{ children: 'Task Description' }}
							textareaProps={{ ...getTextareaProps(fields.description) }}
							errors={fields.description.errors}
						/>

						<SelectField
							labelProps={{ children: 'Task Type' }}
							selectProps={{
								...getSelectProps(fields.type),
								value: taskType,
								onValueChange: value => setTaskType(value as TaskType),
							}}
							options={[
								{ value: TaskType.TEXT, label: 'Text' },
								{ value: TaskType.TRUEFALSE, label: 'True/False' },
								{
									value: TaskType.MULTIPLECHOICE,
									label: 'Multiple Choice',
								},
								{ value: TaskType.CIPHER, label: 'Cipher' },
								{ value: TaskType.MULTIPART, label: 'Multi-Part' },
							]}
						/>

						<div>
							<TaskTypeContent
								taskType={taskType}
								taskData={questionData}
								handleUpdate={setQuestionData}
							/>
							<input
								type="hidden"
								name={fields.data.name}
								value={JSON.stringify(questionData)}
							/>
						</div>

						<Field
							labelProps={{ children: 'Points' }}
							inputProps={{
								...getInputProps(fields.points, { type: 'number' }),
							}}
							errors={fields.points.errors}
						/>

						<Field
							labelProps={{ children: 'Hint' }}
							inputProps={{ ...getInputProps(fields.hint, { type: 'text' }) }}
							errors={fields.hint.errors}
						/>

						<CheckboxField
							labelProps={{ children: 'Allow Multiple Entries' }}
							buttonProps={{
								...getInputProps(fields.multiEntry, { type: 'checkbox' }),
								value: multiEntry ? 'true' : 'false',
								onChange: () => setMultiEntry(!multiEntry),
							}}
							errors={fields.multiEntry.errors}
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

function TaskTypeContent({
	taskType,
	handleUpdate,
	taskData,
}: {
	taskType: TaskType
	taskData: any
	handleUpdate: (data: TaskData<TaskType>) => void
}) {
	switch (taskType) {
		case TaskType.MULTIPLECHOICE:
			return (
				<CreateMultipleChoice taskData={taskData} handleUpdate={handleUpdate} />
			)
		case TaskType.TRUEFALSE:
			return <CreateTrueFalse taskData={taskData} handleUpdate={handleUpdate} />
		case TaskType.TEXT:
			return <ShortAnswer taskData={taskData} handleUpdate={handleUpdate} />
		case TaskType.FILLINTHEBLANK:
			return <FillInTheBlank />
		case TaskType.IMAGEUPLOAD:
			return <ImageUpload />
		case TaskType.VIDEOUPLOAD:
			return <VideoUpload />
		case TaskType.FILEUPLOAD:
			return <FileUpload />
		case TaskType.CIPHER:
			return <Cipher />
		case TaskType.MULTIPART:
			return <CreateMultiPart taskData={taskData} handleUpdate={handleUpdate} />
		default:
			return <>Question title</>
	}
}

const ShortAnswer = ({
	taskData,
	handleUpdate,
}: {
	taskData: TaskData<TaskType.TEXT>
	handleUpdate: (data: TaskData<TaskType.TEXT>) => void
}) => {
	return (
		<>
			<Field
				labelProps={{ children: 'Answer' }}
				inputProps={{
					type: 'text',
					value: taskData?.answer,
					onChange: e => handleUpdate({ ...taskData, answer: e.target.value }),
				}}
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
