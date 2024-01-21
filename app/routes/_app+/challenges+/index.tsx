import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { ChallengeCard } from '#app/components/ui/index.ts';
import { getChallengeListItems } from '#app/models/challenge.server.ts';
import { getUserById } from '#app/models/user.server.ts';
import { requireUserId } from '#app/utils/auth.server.ts';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const user = await getUserById(userId);
  if (!user) throw new Error('User not found');
  const challenges = await getChallengeListItems({
    groups: user?.groups,
  });

  return json({
    challenges,
  });
};

const ChallengesIndexPage = () => {
  const { challenges } = useLoaderData<typeof loader>();

  return (
    <>
      <div className="container">
        <h2 className="mb-4 text-xl font-semibold">Your Challenges</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-4">
          <ChallengeCard title="A Scout Hero's Quest" userProgress={0.31} />
          <ChallengeCard title="A Scout Hero's Quest" userProgress={0.76} />
          <ChallengeCard title="A Scout Hero's Quest" userProgress={0.76} />
          <ChallengeCard title="A Scout Hero's Quest" />
          <ChallengeCard title="A Scout Hero's Quest" />
          {challenges.map((challenge) => (
            <Link
              key={challenge.id}
              to={`./${challenge.id}`}
              className="min-h-[150px]"
            >
              <ChallengeCard title={challenge.name} />
            </Link>
          ))}
        </div>
      </div>
      <div className="container">
        <h2 className="my-4 text-xl font-semibold">Available Challenges</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-4">
          <ChallengeCard title="A Scout Hero's Quest" />
          <ChallengeCard title="A Scout Hero's Quest" />
          <ChallengeCard title="A Scout Hero's Quest" />
          <ChallengeCard title="A Scout Hero's Quest" />
          <ChallengeCard title="A Scout Hero's Quest" />
          <ChallengeCard title="A Scout Hero's Quest" />
        </div>
      </div>
      <div className="container">
        <h2 className="my-4 text-xl font-semibold">Finished Challenges</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-4">
          <ChallengeCard title="A Scout Hero's Quest" userProgress={1} />
        </div>
      </div>
      <pre>{JSON.stringify(challenges, null, 2)}</pre>
    </>
  );
};

export default ChallengesIndexPage;
