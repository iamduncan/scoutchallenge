import CampingAdventure from "~/assets/images/camping-adventure.png";
import ProgressCircular from "../ProgressCircular";

type ChallengeHeroProps = {
  title: string;
  userProgress?: number;
  startDate?: Date | null;
  endDate?: Date | null;
};

const ChallengeHero = ({
  title,
  userProgress,
  startDate,
  endDate,
}: ChallengeHeroProps) => {
  const startDateObj = new Date(startDate || "");
  const endDateObj = new Date(endDate || "");
  const currentDate = new Date();
  const daysLeft = Math.ceil(
    (endDateObj.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const daysLeftText = daysLeft === 1 ? "day" : "days";

  return (
    <>
      <div
        className="flex min-h-[200px] flex-col items-center justify-center bg-cover bg-center bg-no-repeat md:min-h-[400px]"
        style={{ backgroundImage: `url(${CampingAdventure})` }}
      >
        <h1 className="rounded-lg bg-gray-50/60 px-2 py-1 text-center text-3xl font-semibold text-gray-800 md:text-6xl">
          {title}
        </h1>
      </div>
      <div className="flex items-center justify-between border-b bg-white px-6">
        <div className="flex w-fit items-center justify-start">
          {userProgress && (
            <>
              <ProgressCircular
                progress={userProgress}
                size={30}
                className="text-green-600"
                width={3}
              />
              <span className="mr-2 text-base text-green-600">
                {userProgress * 100}% Complete
              </span>
            </>
          )}
        </div>
        <div>
          {daysLeft} {daysLeftText} left
        </div>
      </div>
    </>
  );
};

export default ChallengeHero;
