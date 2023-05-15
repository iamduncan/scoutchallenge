import type {
  Challenge,
  ChallengeSection,
  Question,
  User,
} from "@prisma/client";
import { Link, useParams } from "@remix-run/react";
import { useMatchesData } from "~/utils";

export default function ChallengeSectionView() {
  const { sectionId } = useParams();
  const { challenge, user } = useMatchesData(
    "routes/__app/challenges/$challengeId"
  ) as {
    challenge: Challenge & {
      introductionHtml?: string;
      challengeSections: (ChallengeSection & {
        descriptionHtml?: string;
        questions: (Question & { descriptionHtml?: string })[];
      })[];
    };
    user: User;
  };
  const section = challenge.challengeSections.find(
    (section) => section.id === sectionId
  );

  return (
    <div className="m-6 space-y-4">
      <h1>{section?.title}</h1>
      {section?.descriptionHtml && (
        <div
          dangerouslySetInnerHTML={{ __html: section.descriptionHtml }}
          className="text-lg"
        />
      )}
      {section &&
        section.questions.map((question) => (
          <div key={question.id}>
            <p>{question.title}</p>
            {question.descriptionHtml && (
              <div
                dangerouslySetInnerHTML={{ __html: question.descriptionHtml }}
              />
            )}
            <p>{question.type}</p>
          </div>
        ))}
      <div>
        <Link to="../" className="btn btn-blue mt-8">
          Back to Challenge
        </Link>
      </div>
    </div>
  );
}
