import type { ChallengeSection, Question } from "@prisma/client";
import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { getChallengeSection } from "~/models/challenge.server";

type LoaderData = {
  challengeSection: ChallengeSection & { questions: Question[] };
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const challengeSectionId = params.sectionId;
  if (!challengeSectionId) {
    return {};
  }
  const challengeSection = await getChallengeSection({
    id: challengeSectionId,
  });
  return { challengeSection };
};

export default function ChallengeSectionPage() {
  const { challengeSection } = useLoaderData<LoaderData>();

  return (
    <div className="fixed inset-0 z-50 block h-full w-full overflow-y-auto bg-gray-600 bg-opacity-50">
      <div className="flex h-full w-full items-center justify-center">
        <div className="mx-auto w-10/12 rounded-md border bg-white shadow-lg">
          <div className="flex h-12 w-full items-center justify-between border-b border-gray-400">
            <div></div>
            <h2 className="text-xl font-bold">
              {challengeSection && challengeSection.title}
            </h2>
            <Link to="../" className="pr-6">
              X
            </Link>
          </div>
          <div className="flex max-h-[calc(95vh_-_3rem)] w-full flex-col gap-8 overflow-x-auto p-4">
            {challengeSection.questions.map((question) => (
              <div key={question.id}>{question.title}</div>
            ))}
            <pre>{JSON.stringify(challengeSection.questions, null, 2)}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
