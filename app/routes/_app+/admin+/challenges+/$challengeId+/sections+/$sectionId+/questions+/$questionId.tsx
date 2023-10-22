import { type ActionFunctionArgs, json } from '@remix-run/node';
import { Link, useParams, useRouteLoaderData } from '@remix-run/react';
import { deleteQuestion } from '#app/models/challenge.server.ts';
import { type loader as challengeLoader } from '#app/routes/_app+/challenges+/$challengeId.tsx';
import { requireUserWithRole } from '#app/utils/permissions.ts';

export default function QuestionPage() {
  const params = useParams();
  const data = useRouteLoaderData<typeof challengeLoader>(
    'routes/_app+/challenges+/$challengeId',
  );
  const { sectionId, questionId } = params;
  const section = data?.challenge?.challengeSections.find(
    (section) => section.id === sectionId,
  );
  const question = section?.questions.find(
    (question) => question.id === questionId,
  );
  return (
    <>
      <div className="flex h-12 w-full items-center justify-between border-b border-gray-400 px-4">
        <h2 className="text-xl font-bold">Edit Question</h2>
        <Link to="../../">X</Link>
      </div>
      <div className="flex max-h-[calc(95vh_-_3rem)] w-full flex-col gap-8 overflow-x-auto p-4">
        <div>Edit Question Form</div>
        <pre>{JSON.stringify(question, null, 2)}</pre>
      </div>
    </>
  );
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { challengeId, sectionId, questionId } = params;
  if (request.method === 'DELETE' && questionId) {
    await requireUserWithRole(request, 'SECTIONADMIN');
    try {
      await deleteQuestion({ id: questionId });
      return json({ success: true });
    } catch (error) {
      return json({ success: false, error });
    }
  }
  const formData = await request.formData();
  const title = formData.get('title');
  const description = formData.get('description');
  const answer = formData.get('answer');
  const correctAnswer = formData.get('correctAnswer');
  const questionData = { title, description, answer, correctAnswer };
  console.log(questionData);
  return json({ challengeId, sectionId, questionId, questionData });
};
