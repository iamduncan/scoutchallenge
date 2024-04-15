import { useEffect, useState } from 'react'
import { Field } from '../forms'
import { Button } from '../ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { CreateMultipleChoice } from './multiplechoice-create'
import { CreateTrueFalse } from './truefalse-create'
import { type TaskData, TaskType } from './types'

export function CreateMultiPart({
	taskData,
	handleUpdate,
}: {
	taskData: TaskData<TaskType.MULTIPART>
	handleUpdate: (data: TaskData<TaskType.MULTIPART>) => void
}) {
	const [parts, setParts] = useState<
		{ data: TaskData<TaskType>; type: TaskType }[]
	>([])

	useEffect(() => {
		handleUpdate({ ...taskData, parts })
	}, [parts, handleUpdate, taskData])

	const handleAddPart = <T extends TaskType>(newPart: {
		type: T
		data: TaskData<T>
	}) => {
		const newParts = [...parts, newPart]
		setParts(newParts)
		handleUpdate({ ...taskData, parts: newParts })
	}

	const handleRemovePart = (index: number) => {
		const newParts = parts.filter((_, i) => i !== index)
		setParts(newParts)
		handleUpdate({ ...taskData, parts: newParts })
	}

	const handleUpdatePart = (index: number, data: TaskData<TaskType>) => {
		const newParts = parts.map((part, i) => {
			if (i === index) {
				return { ...part, data }
			}
			return part
		})
		setParts(newParts)
		handleUpdate({ ...taskData, parts: newParts })
	}

	return (
		<>
			<div className="flex flex-col gap-2 pb-4">
				{parts.map((part, index) => (
					<>
						<div key={index} className="flex flex-col border p-2">
							<Field
								labelProps={{ children: 'Question' }}
								inputProps={{ type: 'text' }}
							/>
							<TaskEditor
								taskData={part.data}
								handleUpdate={data => handleUpdatePart(index, data)}
								type={part.type}
							/>
							<div className="flex justify-end">
								<Button
									variant="destructive"
									onClick={() => handleRemovePart(index)}
								>
									Remove
								</Button>
							</div>
						</div>
					</>
				))}
			</div>
			<AddPartDropdown handleAddPart={handleAddPart} />
		</>
	)
}

interface TaskEditorProps<T extends TaskType> {
	taskData: TaskData<T>
	handleUpdate: (data: TaskData<T>) => void
	type: T
}

function TaskEditor<T extends TaskType>({
	taskData,
	handleUpdate,
	type,
}: TaskEditorProps<T>) {
	switch (type) {
		case TaskType.MULTIPLECHOICE:
			return (
				<CreateMultipleChoice
					taskData={taskData as TaskData<TaskType.MULTIPLECHOICE>}
					handleUpdate={
						handleUpdate as (data: TaskData<TaskType.MULTIPLECHOICE>) => void
					}
				/>
			)
		case TaskType.TRUEFALSE:
			return (
				<CreateTrueFalse
					taskData={taskData as TaskData<TaskType.TRUEFALSE>}
					handleUpdate={
						handleUpdate as (data: TaskData<TaskType.TRUEFALSE>) => void
					}
				/>
			)
		default:
			return null
	}
}

function AddPartDropdown({
	handleAddPart,
}: {
	handleAddPart: <T extends TaskType>({
		type,
		data,
	}: {
		type: T
		data: TaskData<T>
	}) => void
}) {
	function onTypeSelect(type: TaskType) {
		switch (type) {
			case TaskType.MULTIPLECHOICE:
				handleAddPart({
					type: TaskType.MULTIPLECHOICE,
					data: {
						question: [],
						answer: '',
					},
				})
				break
			case TaskType.TRUEFALSE:
				handleAddPart({
					type: TaskType.TRUEFALSE,
					data: {
						answer: true,
					},
				})
				break
		}
	}
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="secondary">Add Part</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent side="bottom">
				<DropdownMenuGroup>
					<DropdownMenuItem
						onSelect={() => onTypeSelect(TaskType.MULTIPLECHOICE)}
					>
						Multiple Choice
					</DropdownMenuItem>
					<DropdownMenuItem onSelect={() => onTypeSelect(TaskType.TRUEFALSE)}>
						True or False
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
