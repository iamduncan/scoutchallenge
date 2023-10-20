import ProgressCircular from "../ProgressCircular/index.ts";
import CampingAdventure from "#app/assets/images/camping-adventure.png";

type ChallengeCardProps = {
  title: string;
  userProgress?: number;
};

const ChallengeCard = ({ title, userProgress }: ChallengeCardProps) => {
  return (
    <div
      className="h-full min-h-[150px] rounded-xl bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${CampingAdventure})` }}
    >
      <div className="group flex h-full w-full flex-col justify-between rounded-xl bg-gray-400/25 hover:bg-gray-200/25">
        <h3 className="w-full border-b bg-gray-50/60 px-2 py-1 text-2xl font-semibold text-gray-800 group-hover:bg-gray-50/80">
          {title}
        </h3>
        {userProgress && (
          <div className="flex w-fit items-center justify-start rounded-tr bg-gray-50/60 group-hover:bg-gray-50/80">
            <ProgressCircular
              progress={userProgress}
              size={30}
              className="text-green-600"
              width={3}
            />
            <span className="mr-2 text-base text-green-600">
              {userProgress * 100}% Complete
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengeCard;
