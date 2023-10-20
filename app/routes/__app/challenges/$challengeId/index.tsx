import type {
  Challenge,
  ChallengeSection,
  Question,
  User,
} from "@prisma/client";
import { Link, useRouteLoaderData } from "@remix-run/react";
import { SectionOverview } from "~/components/ui/index.ts";
import { loader as challengeLoader } from "../$challengeId.tsx";

const isAdmin = (role: User["role"]) =>
  role === "ADMIN" || role === "GROUPADMIN" || role === "SECTIONADMIN";

export default function ChallengeIndex() {
  const { challenge, user } = useRouteLoaderData<typeof challengeLoader>(
    "routes/__app/challenges/$challengeId",
  );

  return (
    <>
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
      {isAdmin(user.role) && (
        <div className="flex gap-3 p-4">
          <Link
            to={`/admin/challenges/${challenge.id}`}
            className="btn btn-blue"
          >
            Admin
          </Link>
          <Link
            to={`/admin/challenges/${challenge.id}/edit`}
            className="btn btn-blue"
          >
            Edit
          </Link>
        </div>
      )}
    </>
  );
}
