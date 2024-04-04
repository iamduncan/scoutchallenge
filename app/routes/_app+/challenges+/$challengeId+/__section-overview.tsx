import { type Question } from '@prisma/client'
import { Link } from '@remix-run/react'
import { type MouseEvent, useState } from 'react'
import { Icon } from '#app/components/ui/icon'

type SectionOverviewProps = {
	name: string
	description?: string
	questions: (Pick<Question, 'id' | 'title'> & {
		userStatus?: 'complete' | 'started' | 'needsAttention' | 'notStarted'
	})[]
	challengeId: string
	sectionId: string
	admin?: boolean
}

export function SectionOverview(props: SectionOverviewProps) {
	const { name, description, questions, challengeId, sectionId, admin } = props

	const [expanded, setExpanded] = useState(false)

	return (
		<div className="flex flex-col items-center justify-center rounded-lg border-2">
			<div
				onClick={() => setExpanded(!expanded)}
				className={`flex w-full cursor-pointer items-center justify-between bg-muted px-3 py-2 ${
					expanded ? 'border-b border-border' : ''
				}`}
			>
				<h1 className="rounded-lg text-xl font-semibold md:text-3xl">{name}</h1>
				<div className="flex items-center gap-2">
					{admin && <AdminMenu sectionId={sectionId} />}
					{expanded ? (
						<Icon
							name="chevron-up"
							className="h-8 w-8 rounded-full border-2 border-muted-foreground text-gray-600"
						/>
					) : (
						<Icon
							name="chevron-down"
							className="h-8 w-8 rounded-full border-2 border-muted-foreground text-gray-600"
						/>
					)}
				</div>
			</div>
			<div className={`${expanded ? 'block' : 'hidden'} w-full`}>
				<div className="flex items-center px-3">
					<div
						dangerouslySetInnerHTML={{ __html: description || '' }}
						className="flex-grow py-2 text-xl"
					/>
				</div>
				<ul>
					{questions.map(question => (
						<li
							className="flex w-full items-center justify-between border-t"
							key={question.id}
						>
							<h3 className="rounded-lg bg-gray-50/60 py-2 pl-3 text-center text-lg font-normal text-gray-800 md:text-2xl">
								{question.title}
							</h3>
							{admin && (
								<Link
									to={`/admin/challenges/${challengeId}/sections/${sectionId}/questions/${question.id}`}
								>
									<Icon
										name="pencil-1"
										className="mr-2 h-8 w-8 rounded-full border-2 border-gray-400 p-1 text-gray-600"
									/>
								</Link>
							)}
							{question.userStatus && (
								<QuestionUserStatus status={question.userStatus} />
							)}
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}

function QuestionUserStatus(props: {
	status: 'complete' | 'started' | 'needsAttention' | 'notStarted'
}) {
	const { status } = props

	const getStatusClass = (
		status: 'complete' | 'started' | 'needsAttention' | 'notStarted',
	) => {
		switch (status) {
			case 'complete':
				return 'text-green-500'
			case 'started':
				return 'text-orange-500'
			case 'needsAttention':
				return 'text-red-500'
			case 'notStarted':
				return 'text-grey-300'
			default:
				return 'text-grey-300'
		}
	}

	return (
		<div className="flex flex-col items-center justify-between pr-3">
			<Icon name="check" className={`${getStatusClass(status)} h-6 w-6`} />
		</div>
	)
}

function AdminMenu({ sectionId }: { sectionId: string }) {
	const [menuOpen, setMenuOpen] = useState(false)
	const onClick = (e: MouseEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.stopPropagation()
		setMenuOpen(!menuOpen)
	}

	return (
		<div onClick={onClick} className="relative">
			<Icon
				name="menu"
				className="h-8 w-8 rounded-full border-2 border-gray-400 p-1 text-gray-600"
			/>
			<div
				className={`absolute right-0 z-50 mt-2 rounded border bg-background ${
					menuOpen ? 'block' : 'hidden'
				}`}
			>
				<ul className="flex flex-col">
					<li className="flex items-center hover:bg-muted">
						<Link
							to={`./sections/${sectionId}`}
							className="m-1 whitespace-nowrap px-3 py-2"
						>
							Edit Section
						</Link>
					</li>
					<li className="flex items-center hover:bg-muted">
						<Link
							to={`./sections/${sectionId}/questions/new`}
							className="m-1 whitespace-nowrap px-3 py-2"
						>
							New Question
						</Link>
					</li>
				</ul>
			</div>
		</div>
	)
}
