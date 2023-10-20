import  { type ActionFunction , json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { updateUser } from "#app/models/user.server.ts";
import { requireUserId } from "#app/utils/auth.server.ts";
import { useUser } from "#app/utils/user.ts";

interface ActionData {
  errors?: {
    firstName?: string;
    lastName?: string;
  };
  fields?: {
    firstName?: string;
    lastName?: string;
  };
  formMessage?: {
    type: "success" | "error";
    message: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");

  if (typeof firstName !== "string") {
    return json<ActionData>(
      { errors: { firstName: "First name is required" } },
      { status: 400 },
    );
  }

  if (typeof lastName !== "string") {
    return json<ActionData>(
      { errors: { lastName: "Last name is required" } },
      { status: 400 },
    );
  }

  const userId = await requireUserId(request);
  if (typeof userId !== "string") {
    return json<ActionData>(
      {
        formMessage: { type: "error", message: "User is not logged in" },
        errors: {},
      },
      { status: 400 },
    );
  }

  await updateUser(userId, { name: `${firstName} ${lastName}` });
  return json<ActionData>({
    formMessage: { type: "success", message: "Profile updated" },
  });
};

export default function SettingsProfilePage() {
  const actionData = useActionData<ActionData>();
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.firstName) {
      firstNameRef.current?.focus();
    } else if (actionData?.errors?.lastName) {
      lastNameRef.current?.focus();
    }
  }, [ actionData ]);

  const user = useUser();
  return (
    <>
      <h1 className="text-xl font-semibold">Profile</h1>
      <p>This information will be visible to others in your group/section.</p>
      <div className="mt-4">
        <Form method="post">
          {actionData?.formMessage && (
            <div
              className={`mb-2 w-1/2 ${actionData.formMessage.type === "success"
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
                First name
              </label>
              <input
                id="firstName"
                ref={firstNameRef}
                name="firstName"
                type="text"
                autoComplete="given-name"
                placeholder="Jane"
                defaultValue={user.name || ""}
                aria-invalid={actionData?.errors?.firstName ? true : undefined}
                aria-describedby="firstName-error"
                className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
              />
              {actionData?.errors?.firstName && (
                <div className="pt-1 text-red-700" id="firstName-error">
                  {actionData.errors.firstName}
                </div>
              )}
            </div>
            <div className="w-1/2">
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Last name
              </label>
              <input
                id="lastName"
                ref={lastNameRef}
                name="lastName"
                type="text"
                autoComplete="family-name"
                placeholder="Doe"
                defaultValue={user.name || ""}
                aria-invalid={actionData?.errors?.lastName ? true : undefined}
                aria-describedby="lastName-error"
                className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
              />
              {actionData?.errors?.lastName && (
                <div className="pt-1 text-red-700" id="lastName-error">
                  {actionData.errors.lastName}
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
