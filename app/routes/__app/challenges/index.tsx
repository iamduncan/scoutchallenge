import { Link } from "@remix-run/react";
import { ChallengeCard } from "~/components/ui";

const ChallengesIndexPage = () => {
  return (
    <>
      <div className="px-4">
        <h2 className="mb-4 text-xl font-semibold">Your Challenges</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-4">
          <Link to={`./123456`} className="min-h-[150px]">
            <ChallengeCard title="A Scout Hero's Quest" userProgress={0.31} />
          </Link>
          <ChallengeCard title="A Scout Hero's Quest" userProgress={0.76} />
          <ChallengeCard title="A Scout Hero's Quest" />
        </div>
      </div>
      <div className="px-4">
        <h2 className="my-4 text-xl font-semibold">Available Challenges</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-4">
          <ChallengeCard title="A Scout Hero's Quest" />
          <ChallengeCard title="A Scout Hero's Quest" />
          <ChallengeCard title="A Scout Hero's Quest" />
        </div>
      </div>
      <div className="px-4">
        <h2 className="my-4 text-xl font-semibold">Finished Challenges</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-4">
          <ChallengeCard title="A Scout Hero's Quest" userProgress={1} />
        </div>
      </div>
    </>
  );
};

export default ChallengesIndexPage;
