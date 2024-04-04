import { useEffect, useState } from 'react'
import { SelectField } from '../forms'
import { Button } from '../ui/button'
import { Icon } from '../ui/icon'
import { Input } from '../ui/input'
import { type QuestionType, type QuestionData } from './types'

/**
 * Create a Multiple Choice question component
 */
export function CreateMultipleChoice({
	questionData,
	handleUpdate,
}: {
	questionData: QuestionData<QuestionType.MULTIPLECHOICE>
	handleUpdate: (data: QuestionData<QuestionType.MULTIPLECHOICE>) => void
}) {
	const [options, setOptions] = useState([
		{ id: '1', option: '' },
		{ id: '2', option: '' },
	])
	const [correctAnswer, setCorrectAnswer] = useState('')

	useEffect(() => {
		handleUpdate({ ...questionData, question: options, answer: correctAnswer })
	}, [options, correctAnswer, handleUpdate, questionData])

	const handleAddOption = () => {
		const newId = (parseInt(options[options.length - 1].id) + 1).toString()
		const newOptions = [...options, { id: newId, option: '' }]
		setOptions(newOptions)
		handleUpdate({ ...questionData, question: newOptions })
	}

	const handleRemoveOption = (id: number) => {
		const newOptions = options.filter(option => option.id !== id.toString())
		setOptions(newOptions)
		handleUpdate({ ...questionData, question: newOptions })
	}

	const handleOptionChange = (id: number, value: string) => {
		const newOptions = options.map(option => {
			if (option.id === id.toString()) {
				return { ...option, option: value }
			}
			return option
		})
		setOptions(newOptions)
		handleUpdate({ ...questionData, question: newOptions })
	}

	const handleSelectCorrectAnswer = (value: string) => {
		const id = value
		setCorrectAnswer(id)
		handleUpdate({ ...questionData, answer: id })
	}

	return (
		<>
			<div className="flex flex-col gap-2 pb-4">
				{options.map(option => (
					<div key={option.id} className="flex gap-2">
						<Input
							value={option.option}
							onChange={e =>
								handleOptionChange(parseInt(option.id), e.target.value)
							}
							placeholder={`Enter option ${option.id}`}
						/>
						<Button
							variant="destructive"
							onClick={() => handleRemoveOption(parseInt(option.id))}
						>
							<Icon name="trash" size="md" />
						</Button>
					</div>
				))}
			</div>
			<div className="flex justify-end">
				<Button size="sm" onClick={handleAddOption}>
					Add Option
				</Button>
			</div>
			{/* select correct answer */}
			<SelectField
				labelProps={{ children: 'Select correct answer' }}
				selectProps={{
					name: 'correctAnswer',
					value: correctAnswer,
					onValueChange: handleSelectCorrectAnswer,
				}}
				options={options.map(option => ({
					value: option.id,
					label: `Option ${option.id} - ${option.option}`,
				}))}
			/>
		</>
	)
}
