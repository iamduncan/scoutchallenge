import { useEffect } from 'react'
import { SelectField } from '../forms'
import { type TaskType, type TaskData } from './types'

/**
 * Create a True or False question component
 */
export function CreateTrueFalse({
	taskData,
	handleUpdate,
}: {
	taskData: TaskData<TaskType.TRUEFALSE>
	handleUpdate: (data: TaskData<TaskType.TRUEFALSE>) => void
}) {
	// Set default values for the first render only
	const setDefaultValues = () => {
		if (typeof taskData.answer !== 'boolean') {
			handleUpdate({ answer: true })
		}
	}

	useEffect(setDefaultValues, [handleUpdate, taskData])

	return (
		<div className="true-false">
			<div className="answer">
				<SelectField
					labelProps={{ children: 'Answer' }}
					selectProps={{
						name: 'answer',
						value: taskData.answer ? 'true' : 'false',
						onValueChange: value => handleUpdate({ answer: value === 'true' }),
					}}
					options={[
						{ value: 'true', label: 'True' },
						{ value: 'false', label: 'False' },
					]}
				/>
			</div>
		</div>
	)
}
