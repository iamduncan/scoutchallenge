import { ExclamationIcon } from "@heroicons/react/outline";
import type {
  Challenge,
  ChallengeSection,
  Question,
  User,
} from "@prisma/client";
import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { ChallengeHero, SectionOverview } from "~/components/ui";
import { getChallenge } from "~/models/challenge.server";
import { getUser } from "~/session.server";

type LoaderData = {
  challenge: Challenge & {
    introductionHtml?: string;
    challengeSections: (ChallengeSection & {
      questions: Question[];
      descriptionHtml?: string;
    })[];
  };
  user: User;
};

const isAdmin = (user: User) =>
  user?.role === "ADMIN" ||
  user?.role === "GROUPADMIN" ||
  user?.role === "SECTIONADMIN";

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await getUser(request);
  const challengeId = params.challengeId;
  if (!challengeId) {
    return json({ status: 404, message: "Challenge not found" });
  }
  const challenge = await getChallenge({ id: challengeId });
  if (
    user &&
    !isAdmin(user) &&
    (challenge.status === "DRAFT" || challenge.status === "DELETED")
  ) {
    return redirect("../");
  }
  return {
    challenge: {
      ...challenge,
    },
    user,
  };
};

const ChallengeView = () => {
  const { challenge, user } = useLoaderData<LoaderData>();

  return (
    <div>
      <ChallengeHero
        title="A Scout Hero's Quest"
        userProgress={0}
        endDate={challenge.closeDate}
      />
      {isAdmin(user) && challenge.status === "DRAFT" && (
        <div className="mx-auto mt-6 flex w-11/12 items-center justify-center gap-2 rounded border border-red-500 bg-red-100 py-3 text-xl font-semibold text-red-600 md:w-10/12">
          <ExclamationIcon className="h-6 w-6" /> Challenge is not published.
        </div>
      )}
      {challenge.introductionHtml && (
        <div className="my-6 px-4">
          <h3 className="text-2xl font-semibold">Introduction</h3>
          <div
            dangerouslySetInnerHTML={{ __html: challenge.introductionHtml }}
            className="text-lg"
          />
        </div>
      )}
      <div className="flex flex-col gap-3 p-4">
        {challenge.challengeSections.map((section) => (
          <SectionOverview
            key={section.id}
            title={section.title}
            description={section.descriptionHtml}
            questions={section.questions}
            challengeId={challenge.id}
            sectionId={section.id}
          />
        ))}
      </div>
      {isAdmin(user) && (
        <div className="flex gap-3 p-4">
          <Link
            to={`/admin/challenges/${challenge.id}`}
            className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Admin
          </Link>
          <Link
            to={`/admin/challenges/${challenge.id}/edit`}
            className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Edit
          </Link>
        </div>
      )}
      <div className="container overflow-x-auto">
        <pre>{JSON.stringify(challenge, null, 2)}</pre>
      </div>
    </div>
  );
};

export default ChallengeView;
