import { Form } from "@remix-run/react";
import { useRef } from "react";
import type { Prisma } from "@prisma/client";
import { ChallengeStatus } from "@prisma/client";
import type { ActionFunction } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import { createChallenge } from "~/models/challenge.server";
import { getUser } from "~/session.server";

function validateName(content: string) {
  if (content.length < 5) {
    return `That title is too short`;
  }
}

type ActionData = {
  errors?: {
    name?: string;
  };
  formError?: string;
  fields?: Prisma.ChallengeCreateInput;
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const user = await getUser(request);
  if (!user) {
    return badRequest({
      formError: "You must be logged in to create a challenge",
    });
  }
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const openDate = formData.get("openDate") as string | null;
  const closeDate = formData.get("closeDate") as string | null;
  const status = formData.get("status") as ChallengeStatus;

  const errors = {
    name: validateName(name),
  };

  const fields: Prisma.ChallengeCreateInput = {
    name,
    openDate: openDate !== null ? new Date(openDate) : null,
    closeDate: closeDate !== null ? new Date(closeDate) : null,
    status: (status as ChallengeStatus) || "OPEN",
    createdBy: {
      connect: {
        id: user.id,
      },
    },
    updatedBy: {
      connect: {
        id: user.id,
      },
    },
  };
  if (Object.values(errors).some(Boolean)) {
    return badRequest({ errors, fields });
  }
  const challenge = await createChallenge(fields);
  return redirect(`/admin/challenges/${challenge.id}`);
};

export default function NewChallenge() {
  const nameRef = useRef<HTMLInputElement>(null);
  return (
    <Form method="post" className="flex w-full flex-col gap-8">
      <div>
        <label htmlFor="name" className="flex w-full flex-col gap-1">
          <span>Name: </span>
          <input
            ref={nameRef}
            type="text"
            name="name"
            id="name"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
          />
        </label>
      </div>

      <div>
        <label htmlFor="openDate" className="flex w-full flex-col gap-1">
          <span>Open Date: </span>
          <input
            type="date"
            name="openDate"
            id="openDate"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
          />
        </label>
      </div>

      <div>
        <label htmlFor="closeDate" className="flex w-full flex-col gap-1">
          <span>Close Date: </span>
          <input
            type="date"
            name="closeDate"
            id="closeDate"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
          />
        </label>
      </div>

      <div>
        <label htmlFor="status" className="flex w-full flex-col gap-1">
          <span>Status: </span>
          <select
            name="status"
            id="status"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 py-1 text-lg leading-loose"
          >
            <option value={ChallengeStatus.DRAFT}>Draft</option>
            <option value={ChallengeStatus.PUBLISHED}>Published</option>
          </select>
        </label>
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Save
        </button>
      </div>
    </Form>
  );
}
