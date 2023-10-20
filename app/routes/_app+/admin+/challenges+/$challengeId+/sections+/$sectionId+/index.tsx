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
    <>
      <div className="flex h-12 w-full items-center justify-between border-b border-gray-400 pl-4">
        <h2 className="text-xl font-bold">
          {challengeSection && challengeSection.title}
        </h2>
        <Link to="../../" className="pr-6">
          X
        </Link>
      </div>
      <div className="flex max-h-[calc(95vh_-_3rem)] w-full flex-col gap-8 overflow-x-auto p-4">
        {challengeSection.questions.map((question) => (
          <div key={question.id}>{question.title}</div>
        ))}
        <pre>{JSON.stringify(challengeSection.questions, null, 2)}</pre>
      </div>
    </>
  );
}
