import type { Challenge, ChallengeSection, Question } from "@prisma/client";
import { Link, useParams } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { deleteQuestion } from "~/models/challenge.server";
import { requireSectionAdmin } from "~/session.server";
import { useMatchesData } from "~/utils";

export default function QuestionPage() {
  const params = useParams();
  const data = useMatchesData("routes/__app/admin/challenges/$challengeId") as {
    challenge: Challenge & {
      challengeSections: (ChallengeSection & { questions: Question[] })[];
    };
  };
  const { sectionId, questionId } = params;
  const section = data?.challenge?.challengeSections.find(
    (section) => section.id === sectionId
  );
  const question = section?.questions.find(
    (question) => question.id === questionId
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

export const action = async ({ request, params }: ActionArgs) => {
  const { challengeId, sectionId, questionId } = params;
  if (request.method === "DELETE" && questionId) {
    await requireSectionAdmin(request);
    try {
      await deleteQuestion({ id: questionId });
      return json({ success: true });
    } catch (error) {
      return json({ success: false, error });
    }
  }
  const formData = await request.formData();
  const title = formData.get("title");
  const description = formData.get("description");
  const answer = formData.get("answer");
  const correctAnswer = formData.get("correctAnswer");
  const questionType = formData.get("questionType");
  const questionData = { title, description, answer, correctAnswer };
  console.log(questionData);
  return json({ challengeId, sectionId, questionId, questionData });
};
