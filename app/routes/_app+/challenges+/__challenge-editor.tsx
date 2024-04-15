import {
	FormProvider,
	getFormProps,
	getInputProps,
	getSelectProps,
	getTextareaProps,
	useForm,
} from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { type Challenge } from '@prisma/client'
import { type SerializeFrom } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import { z } from 'zod'
import { floatingToolbarClassName } from '#app/components/floating-toolbar'
import {
	ErrorList,
	Field,
	SelectField,
	TextareaField,
} from '#app/components/forms'
import { Button } from '#app/components/ui/button'
import { StatusButton } from '#app/components/ui/status-button'
import { useIsPending } from '#app/utils/misc'
import { type action } from './__challenge-editor.server'

export const ChallengeSchema = z.object({
	id: z.string().optional(),
	name: z.string(),
	description: z.string().optional(),
	type: z.enum(['standard', 'group']),
	status: z.enum(['draft', 'published', 'archived']),
})

export function ChallengeEditor({
	challenge,
}: {
	challenge?: SerializeFrom<
		Pick<Challenge, 'id' | 'name' | 'description' | 'type' | 'status'>
	>
}) {
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const [form, fields] = useForm({
		id: 'challenge-editor',
		constraint: getZodConstraint(ChallengeSchema),
		lastResult: actionData?.result,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: ChallengeSchema })
		},
		defaultValue: {
			...challenge,
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
					{challenge ? (
						<input type="hidden" name="id" value={challenge.id} />
					) : null}
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

						<SelectField
							labelProps={{ children: 'Challenge Type' }}
							selectProps={{
								...getSelectProps(fields.type, { value: false }),
								defaultValue: challenge?.type,
							}}
							placeholder="Select a challenge type"
							options={[
								{
									label: 'Standard',
									value: 'standard',
								},
								{
									label: 'Group',
									value: 'group',
								},
							]}
							errors={fields.type.errors}
						/>

						<SelectField
							labelProps={{ children: 'Status' }}
							selectProps={{
								...getSelectProps(fields.status, { value: false }),
								defaultValue: challenge?.status,
							}}
							placeholder="Select a status"
							options={[
								{
									label: 'Draft',
									value: 'draft',
								},
								{
									label: 'Published',
									value: 'published',
								},
								{
									label: 'Archived',
									value: 'archived',
								},
							]}
							errors={fields.status.errors}
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
