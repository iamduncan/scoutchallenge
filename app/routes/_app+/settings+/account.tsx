import { Form, useActionData } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { useEffect, useRef } from "react";
import { updateUser } from "#app/models/user.server.ts";
// import { getUserId } from "~/session.server";
import { useUser, validateEmail } from "#app/utils/utils.ts";
import { requireUserId } from "~/utils/auth.server.ts";

interface ActionData {
  errors?: {
    email?: string;
  };
  fields?: {
    email?: string;
  };
  formMessage?: {
    type: "success" | "error";
    message: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");

  if (!validateEmail(email)) {
    return json<ActionData>(
      { errors: { email: "Email is invalid" } },
      { status: 400 },
    );
  }

  const userId = await requireUserId(request);
  if (typeof userId !== "string") {
    return json<ActionData>(
      { formMessage: { type: "error", message: "User is not logged in" } },
      { status: 400 },
    );
  }

  await updateUser(userId, { email });
  return json<ActionData>({
    formMessage: { type: "success", message: "Profile updated" },
  });
};

export default function SettingsAccountPage() {
  const actionData = useActionData<ActionData>();
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    }
  }, [actionData]);

  const user = useUser();
  return (
    <>
      <h1 className="text-xl font-semibold">Account</h1>
      <div className="mt-4">
        <Form method="post">
          {actionData?.formMessage && (
            <div
              className={`mb-2 w-1/2 ${
                actionData.formMessage.type === "success"
                  ? "border-l-4 border-green-500 bg-green-100 px-4 py-2 text-green-700"
                  : "border-l-4 border-red-500 bg-red-100 px-4 py-2 text-red-700"
              }`}
            >
              <p className="font-medium">{actionData.formMessage.message}</p>
            </div>
          )}
          <div className="flex items-center gap-6">
            <div className="w-1/2">
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Email
              </label>
              <input
                id="email"
                ref={emailRef}
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Email"
                defaultValue={user.email}
                aria-invalid={actionData?.errors?.email ? true : false}
                aria-describedby="email-error"
                className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
              />
              {actionData?.errors?.email && (
                <div id="email-error" className="pt-1 text-red-700">
                  {actionData.errors.email}
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 flex items-center gap-6">
            <button className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400">
              Update Profile
            </button>
          </div>
        </Form>
      </div>
    </>
  );
}
