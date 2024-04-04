import { useEffect } from 'react'
import { SelectField } from '../forms'
import { type QuestionType, type QuestionData } from './types'

/**
 * Create a True or False question component
 */
export function CreateTrueFalse({
	questionData,
	handleUpdate,
}: {
	questionData: QuestionData<QuestionType.TRUEFALSE>
	handleUpdate: (data: QuestionData<QuestionType.TRUEFALSE>) => void
}) {
	// Set default values for the first render only
	const setDefaultValues = () => {
		if (typeof questionData.answer !== 'boolean') {
			handleUpdate({ answer: true })
		}
	}

	useEffect(setDefaultValues, [handleUpdate, questionData])

	return (
		<div className="true-false">
			<div className="answer">
				<SelectField
					labelProps={{ children: 'Answer' }}
					selectProps={{
						name: 'answer',
						value: questionData.answer ? 'true' : 'false',
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
