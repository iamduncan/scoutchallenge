import { createHeadlessEditor } from "@lexical/headless";
import { $generateHtmlFromNodes } from "@lexical/html";
import type { Challenge, User } from "@prisma/client";
import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { createEditor } from "lexical";
import { ChallengeHero, SectionOverview } from "~/components/ui";
import { getChallenge } from "~/models/challenge.server";
import { getUser } from "~/session.server";

type LoaderData = {
  challenge: Challenge & { introductionHtml?: string };
  user: User;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await getUser(request);
  const challengeId = params.challengeId;
  if (!challengeId) {
    return json({ status: 404, message: "Challenge not found" });
  }
  const challenge = await getChallenge({ id: challengeId });
  return {
    challenge: {
      ...challenge,
    },
    user,
  };
};

const isAdmin = (user: User) =>
  user?.role === "ADMIN" ||
  user?.role === "GROUPADMIN" ||
  user?.role === "SECTIONADMIN";

const ChallengeView = () => {
  const { challenge, user } = useLoaderData<LoaderData>();
  let introHtml = "";
  if (typeof window !== "undefined") {
    introHtml = generateHTML(challenge.introduction || "");
  }

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
            dangerouslySetInnerHTML={{ __html: introHtml }}
            className="text-lg"
          />
        </div>
      )}
      <div className="flex flex-col gap-3 p-4">
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
      {isAdmin(user) && (
        <div className="flex flex-col gap-3 p-4">
          <Link
            to={`/admin/challenges/${challenge.id}/edit`}
            className="flex flex-col gap-3 p-4"
          >
            Edit
          </Link>
        </div>
      )}
      <div className="container overflow-x-auto">
        <pre>{JSON.stringify(challenge, null, 2)}</pre>
      </div>
    </div>
  );
};

export default ChallengeView;

// generate introduction HTML from lexical editor state
export function generateHTML(editorState: string): string {
  const editor = createEditor({
    editorState: JSON.parse(editorState),
    namespace: "challenge",
    nodes: [],
    onError: (error: any) => {
      console.error(error);
    },
  });
  let html = "";
  editor.update(() => {
    console.log("generateHTML", editor.getEditorState()._nodeMap.get("root"));
    html = $generateHtmlFromNodes(editor);
  });
  return html;
}
