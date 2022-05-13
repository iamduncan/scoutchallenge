import type { Challenge } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { getChallenge } from "~/models/challenge.server";

type LoaderData = {
  challenge: Challenge;
};

export const loader: LoaderFunction = async ({ params }) => {
  const challengeId = params.challengeId;
  if (!challengeId) {
    return {};
  }
  const challenge = await getChallenge({ id: challengeId });
  return { challenge };
};

export default function ViewChallengePage() {
  const { challenge } = useLoaderData<LoaderData>();
  return (
    <div>
      <div>{challenge?.name}</div>
      <div>
        <pre>{JSON.stringify(challenge, null, 2)}</pre>
      </div>
    </div>
  );
}
