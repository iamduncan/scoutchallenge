import type {
  Challenge,
  ChallengeSection,
  Question,
  Role,
  User,
} from "@prisma/client";
import { Link, useRouteLoaderData } from "@remix-run/react";
import { SectionOverview } from "#app/components/ui/index.ts";
import { loader as challengeLoader } from "../$challengeId.tsx";

const isAdmin = (roles: Pick<Role, 'name'>[]) =>
  roles.find((role) => role.name === "ADMIN");

export default function ChallengeIndex() {
  const data = useRouteLoaderData<typeof challengeLoader>(
    "routes/__app/challenges/$challengeId",
  );
  if (!data) throw new Error("No data");
  const { challenge, user } = data;

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
      {isAdmin(user.roles) && (
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
