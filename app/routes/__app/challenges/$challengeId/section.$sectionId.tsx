import type {
  Challenge,
  ChallengeSection,
  Question,
  User,
} from "@prisma/client";
import { Form, Link, useParams, useSearchParams } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import {
  AnswerCipher,
  AnswerFillInTheBlank,
  AnswerMultipleChoice,
  Button,
} from "~/components/ui";
import type { QuestionData } from "~/components/ui/Questions/types";
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
  const [searchParams] = useSearchParams();
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
      <Form method="post">
        {section &&
          section.questions.map((question) => (
            <div key={question.id}>
              <p>{question.title}</p>
              {question.descriptionHtml && (
                <div
                  dangerouslySetInnerHTML={{ __html: question.descriptionHtml }}
                />
              )}
              <QuestionComponent question={question} />
            </div>
          ))}
        <Button submit>Submit</Button>
      </Form>
      <div>
        <Link to="../" className="btn btn-blue mt-8">
          Back to Challenge
        </Link>
      </div>
      {searchParams.get("debug") === "true" && user.role.includes("ADMIN") && (
        <pre className="text-sm">{JSON.stringify(section, null, 2)}</pre>
      )}
    </div>
  );
}

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData.entries());
  console.log(data);
  return json({ data });
};

const QuestionComponent = ({ question }: { question: Question }) => {
  switch (question.type) {
    case "MULTIPLECHOICE":
      return (
        <AnswerMultipleChoice
          questionData={question.data as QuestionData<"MULTIPLECHOICE">}
          handleUpdate={() => {}}
          name={question.id}
        />
      );
    case "FILLINTHEBLANK":
      return (
        <AnswerFillInTheBlank
          questionData={question.data as QuestionData<"FILLINTHEBLANK">}
          handleUpdate={() => {}}
        />
      );
    case "CIPHER":
      return (
        <AnswerCipher
          questionData={question.data as QuestionData<"CIPHER">}
          handleUpdate={() => {}}
        />
      );
    default:
      return null;
  }
};
