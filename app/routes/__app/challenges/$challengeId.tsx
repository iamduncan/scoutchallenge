import { ChallengeHero, SectionOverview } from "~/components/ui";

const ChallengeView = () => {
  return (
    <div>
      <ChallengeHero title="A Scout Hero's Quest" userProgress={0.23} />
      <div className="px-4">
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
    </div>
  );
};

export default ChallengeView;
