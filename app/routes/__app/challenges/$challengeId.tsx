import type { Challenge } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { ChallengeHero, SectionOverview } from "~/components/ui";
import { getChallenge } from "~/models/challenge.server";

type LoaderData = {
  challenge: Challenge;
};

export const loader: LoaderFunction = async ({ params }) => {
  const challengeId = params.challengeId;
  if (!challengeId) {
    return json({ status: 404, message: "Challenge not found" });
  }
  const challenge = await getChallenge({ id: challengeId });
  return {
    challenge,
  };
};

const ChallengeView = () => {
  const { challenge } = useLoaderData<LoaderData>();

  return (
    <div>
      <ChallengeHero
        title="A Scout Hero's Quest"
        userProgress={0.23}
        endDate={challenge.closeDate}
      />
      {challenge.introduction && (
        <div className="my-8 px-4">
          <h3 className="text-2xl font-semibold">Introduction</h3>
          <div
            dangerouslySetInnerHTML={{ __html: challenge.introduction }}
            className="text-lg"
          />
        </div>
      )}
      <div className="flex flex-col gap-3 px-4">
        <SectionOverview title="Hero Skills" questions={[]} />
        <SectionOverview
          title="Hero Knowledge"
          questions={[
            {
              id: "123",
              title: "Complete Wordsearch",
              userStatus: "complete",
              order: 1,
            },
            {
              id: "124",
              title: "Complete diet sheet",
              userStatus: "complete",
              order: 2,
            },
            {
              id: "125",
              title: "How to stay hygienic on camp",
              userStatus: "needsAttention",
              order: 3,
            },
            {
              id: "126",
              title: "Solve the code",
              userStatus: "started",
              order: 4,
            },
            {
              id: "127",
              title: "Learn the phonetic alphabet",
              userStatus: "notStarted",
              order: 5,
            },
          ]}
        />
      </div>
      <div className="container hidden overflow-x-auto">
        <pre>{JSON.stringify(challenge, null, 2)}</pre>
      </div>
    </div>
  );
};

export default ChallengeView;
