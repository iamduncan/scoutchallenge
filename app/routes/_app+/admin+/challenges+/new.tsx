import { useForm, conform } from '@conform-to/react';
import { getFieldsetConstraint, parse } from '@conform-to/zod';
import { ChallengeType, ChallengeStatus } from '@prisma/client';
import { json, type DataFunctionArgs } from '@remix-run/node';
import { Form, useFetcher, useLoaderData } from '@remix-run/react';
import { type EditorState, type LexicalEditor } from 'lexical';
import { useState } from 'react';
import { AuthenticityTokenInput } from 'remix-utils/csrf/react';
import { z } from 'zod';
import { ErrorList, Field, SelectField } from '#app/components/forms.tsx';
import { Button } from '#app/components/ui/button.tsx';
import Editor from '#app/components/ui/Editor/Editor.tsx';
import { StatusButton } from '#app/components/ui/status-button.tsx';
import { getGroupListItems } from '#app/models/group.server.ts';
import { requireUserId } from '#app/utils/auth.server.ts';
import { redirectWithConfetti } from '#app/utils/confetti.server.ts';
import { validateCSRF } from '#app/utils/csrf.server.ts';
import { prisma } from '#app/utils/db.server.ts';
import { useUser } from '#app/utils/user.ts';

export const loader = async () => {
  const groups = await getGroupListItems();
  return json({ groups });
};

const ChallengeSchema = z.object({
  name: z.string().min(5),
  openDate: z.date().optional(),
  closeDate: z.string().optional(),
  introduction: z.string().optional(),
  type: z.nativeEnum(ChallengeType).optional(),
  status: z.nativeEnum(ChallengeStatus).optional(),
  group: z.string(),
});

export const action = async ({ request }: DataFunctionArgs) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  await validateCSRF(formData, request.headers);

  const submission = await parse(formData, {
    schema: ChallengeSchema,
    async: true,
  });

  if (submission.intent !== 'submit') {
    return json({ status: 'idle', submission } as const);
  }

  if (!submission.value) {
    return json({ status: 'error', submission } as const, { status: 400 });
  }

  const { name, openDate, closeDate, introduction, type, status, group } =
    submission.value;

  const challenge = await prisma.challenge.create({
    data: {
      name,
      openDate,
      closeDate,
      introduction,
      type,
      status,
      group: { connect: { id: group } },
      createdBy: { connect: { id: userId } },
      updatedBy: { connect: { id: userId } },
    },
  });

  return redirectWithConfetti(`/admin/challenges/${challenge.id}`);
};

// When the editor changes, you can get notified via the
// LexicalOnChangePlugin!

export default function NewChallenge() {
  const challengeFetcher = useFetcher<typeof action>();
  const isPending = challengeFetcher.state !== 'idle';

  const [form, fields] = useForm({
    id: 'new-challenge',
    constraint: getFieldsetConstraint(ChallengeSchema),
    lastSubmission: challengeFetcher.data?.submission,
    onValidate: ({ formData }) => {
      return parse(formData, { schema: ChallengeSchema });
    },
  });

  const user = useUser();
  const { groups } = useLoaderData<typeof loader>();

  const [introduction, setIntroduction] = useState<string>();
  function onChange(editorState: EditorState, editor: LexicalEditor) {
    editor.update(() => {
      const editorState = editor.getEditorState();
      const jsonString = JSON.stringify(editorState);
      setIntroduction(jsonString);
    });
  }

  return (
    <>
      <Form
        method="post"
        className="flex w-full flex-col gap-8"
        {...form.props}
      >
        <AuthenticityTokenInput />
        {/*
					This hidden submit button is here to ensure that when the user hits
					"enter" on an input field, the primary form function is submitted
					rather than the first button in the form (which is delete/add image).
				*/}
        <button type="submit" className="hidden" />
        {form.error === 'error' && (
          <div className="text-sm font-bold text-red-600">{form.error}</div>
        )}
        <div>
          <Field
            labelProps={{ children: 'Name' }}
            inputProps={{
              autoFocus: true,
              ...conform.input(fields.name, { ariaAttributes: true }),
            }}
            errors={fields.name.errors}
          />
        </div>

        <div>
          <Field
            labelProps={{ children: 'Open Date' }}
            inputProps={{
              ...conform.input(fields.openDate, {
                ariaAttributes: true,
                type: 'date',
              }),
            }}
            errors={fields.openDate.errors}
          />
        </div>

        <div>
          <Field
            labelProps={{ children: 'Close Date' }}
            inputProps={{
              ...conform.input(fields.closeDate, {
                ariaAttributes: true,
                type: 'date',
              }),
            }}
            errors={fields.closeDate.errors}
          />
        </div>

        <div>
          <label htmlFor="introduction" className="flex w-full flex-col gap-1">
            <span>Introduction: </span>
            <Editor onChange={onChange} />
            <input
              type="hidden"
              name="introduction"
              defaultValue={introduction}
            />
          </label>
        </div>

        <div>
          <SelectField
            labelProps={{ children: 'Type' }}
            inputProps={{
              ...conform.input(fields.type, { ariaAttributes: true }),
              placeholder: 'Select a type',
            }}
            options={[
              { label: 'Standard', value: ChallengeType.STANDARD },
              { label: 'Contest', value: ChallengeType.CONTEST },
              { label: 'Live', value: ChallengeType.LIVE },
              { label: 'Team', value: ChallengeType.TEAM },
            ]}
            errors={fields.type.errors}
          />
        </div>

        <div>
          <label htmlFor="status" className="flex w-full flex-col gap-1">
            <span>Status: </span>
            <select
              name="status"
              id="status"
              className="flex-1 rounded-md border-2 border-blue-500 px-3 py-1 text-lg leading-loose"
            >
              <option value={ChallengeStatus.DRAFT}>Draft</option>
              <option value={ChallengeStatus.PUBLISHED}>Published</option>
            </select>
          </label>
        </div>

        {user?.roles.find((role) => role.name === 'admin') && (
          <div>
            <label className="flex w-full flex-col gap-1">
              <span>Group: </span>
              <select
                name="group"
                id="group"
                className="flex-1 rounded-md border-2 border-blue-500 px-3 py-1 text-lg leading-loose"
              >
                <option value="">None</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

        <ErrorList id={form.errorId} errors={form.errors} />
      </Form>
      <div className="flex justify-end gap-4">
        <Button form={form.id} variant="destructive" type="reset">
          Reset
        </Button>
        <StatusButton
          form={form.id}
          type="submit"
          disabled={isPending}
          status={isPending ? 'pending' : 'idle'}
          className="btn btn-green"
        >
          Save
        </StatusButton>
      </div>
    </>
  );
}
