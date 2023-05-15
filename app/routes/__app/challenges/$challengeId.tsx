import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import type { User } from "@prisma/client";
import { RoleType, ChallengeStatus } from "@prisma/client";
import { Outlet, useLoaderData, useSearchParams } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { ChallengeHero } from "~/components/ui";
import { getChallenge } from "~/models/challenge.server";
import { getUser } from "~/session.server";

const isAdmin = (role: User["role"]) =>
  role === RoleType.ADMIN ||
  role === RoleType.GROUPADMIN ||
  role === RoleType.SECTIONADMIN;

export const loader = async ({ request, params }: LoaderArgs) => {
  const user = await getUser(request);
  if (!user) {
    return redirect("/login");
  }
  const challengeId = params.challengeId;
  if (!challengeId) {
    throw new Response("Not Found", { status: 404 });
  }
  const challenge = await getChallenge({ id: challengeId });
  if (
    user &&
    !isAdmin(user.role) &&
    (challenge.status === ChallengeStatus.DRAFT ||
      challenge.status === ChallengeStatus.DELETED)
  ) {
    return redirect("../");
  }
  return json({
    challenge: {
      ...challenge,
    },
    user,
  });
};

const ChallengeView = () => {
  const { user, challenge } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();

  return (
    <div>
      <ChallengeHero
        title={challenge.name}
        userProgress={0}
        endDate={challenge.closeDate}
      />
      {isAdmin(user.role) && challenge.status === ChallengeStatus.DRAFT && (
        <div className="mx-auto mt-6 flex w-11/12 items-center justify-center gap-2 rounded border border-red-500 bg-red-100 py-3 text-xl font-semibold text-red-600 md:w-10/12">
          <ExclamationTriangleIcon className="h-6 w-6" /> Challenge is not
          published.
        </div>
      )}

      <Outlet />

      {searchParams.get("debug") === "true" && (
        <div className="container overflow-x-auto">
          <pre>{JSON.stringify(challenge, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ChallengeView;
