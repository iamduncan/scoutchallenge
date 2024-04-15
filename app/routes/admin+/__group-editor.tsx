import {
	FormProvider,
	getFormProps,
	getInputProps,
	getTextareaProps,
	useForm,
} from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { type Group } from '@prisma/client'
import { type SerializeFrom } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import { z } from 'zod'
import { GeneralErrorBoundary } from '#app/components/error-boundary'
import { floatingToolbarClassName } from '#app/components/floating-toolbar'
import { ErrorList, Field, TextareaField } from '#app/components/forms'
import { Button } from '#app/components/ui/button'
import { StatusButton } from '#app/components/ui/status-button'
import { useIsPending } from '#app/utils/misc'
import { type action } from './__group-editor.server'

export const GroupSchema = z.object({
	id: z.string().optional(),
	name: z.string(),
	description: z.string().optional(),
})

export function GroupEditor({
	group,
}: {
	group?: SerializeFrom<Pick<Group, 'id' | 'name' | 'description'>>
}) {
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const [form, fields] = useForm({
		id: 'group-editor',
		constraint: getZodConstraint(GroupSchema),
		lastResult: actionData?.result,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: GroupSchema })
		},
		defaultValue: {
			...group,
		},
		shouldRevalidate: 'onBlur',
	})

	return (
		<div className="absolute inset-0">
			<FormProvider context={form.context}>
				<Form
					method="POST"
					className="flex h-full flex-col gap-y-4 overflow-y-auto overflow-x-hidden px-10 pb-28 pt-12"
					{...getFormProps(form)}
				>
					<button type="submit" className="hidden" />
					{group ? <input type="hidden" name="id" value={group.id} /> : null}
					<div className="flex flex-col gap-1">
						<Field
							labelProps={{ children: 'Name' }}
							inputProps={{
								autoFocus: true,
								...getInputProps(fields.name, { type: 'text' }),
							}}
							errors={fields.name.errors}
						/>
						<TextareaField
							labelProps={{ children: 'Description' }}
							textareaProps={{
								...getTextareaProps(fields.description),
							}}
							errors={fields.description.errors}
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

export function ErrorBoundary() {
	return (
		<GeneralErrorBoundary
			statusHandlers={{
				404: ({ params }) => (
					<p>No group with the id "{params.groupId}" exists</p>
				),
			}}
		/>
	)
}
