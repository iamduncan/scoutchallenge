import type {
  Challenge,
  ChallengeSection,
  Question,
  User,
} from "@prisma/client";
import { Form, Link, useParams, useRouteLoaderData, useSearchParams } from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  AnswerCipher,
  AnswerFillInTheBlank,
  AnswerMultipleChoice,
  AnswerTrueFalse,
  Button,
} from "#app/components/ui/index.ts";
import { type loader as challengeLoader } from "#app/routes/_app+/challenges+/$challengeId.tsx";
import type { QuestionData } from "#app/components/ui/Questions/types.ts";

export default function ChallengeSectionView() {
  const { sectionId } = useParams();
  const data = useRouteLoaderData<typeof challengeLoader>(
    "routes/_app+/challenges+/$challengeId"
  );
  if (!data) throw new Error("No data");
  const { challenge, user } = data;
  const [ searchParams ] = useSearchParams();
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
        {section?.questions.map((question) => (
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
      {searchParams.get("debug") === "true" && user.roles.find((role) => role.name === 'ADMIN') && (
        <pre className="text-sm">{JSON.stringify(section, null, 2)}</pre>
      )}
    </div>
  );
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData.entries());
  console.log(data);
  return json({ data });
};

const QuestionComponent = ({ question }: { question: Omit<Question, 'createdAt' | 'updatedAt'> }) => {
  switch (question.type) {
    case "MULTIPLECHOICE":
      return (
        <AnswerMultipleChoice
          questionData={question.data as QuestionData<"MULTIPLECHOICE">}
          handleUpdate={() => { }}
          name={question.id}
        />
      );
    case "TRUEFALSE":
      return (
        <AnswerTrueFalse
          questionData={question.data as QuestionData<"TRUEFALSE">}
          handleUpdate={() => { }}
          name={question.id}
        />
      );
    case "FILLINTHEBLANK":
      return (
        <AnswerFillInTheBlank
          questionData={question.data as QuestionData<"FILLINTHEBLANK">}
          handleUpdate={() => { }}
        />
      );
    case "CIPHER":
      return (
        <AnswerCipher
          questionData={question.data as QuestionData<"CIPHER">}
          handleUpdate={() => { }}
        />
      );
    default:
      return null;
  }
};
