import { Form, useActionData } from "@remix-run/react";
import  { type ActionFunction , json } from "@remix-run/server-runtime";
import { useEffect, useRef } from "react";
import { updateUserPassword } from "#app/models/user.server.ts";
import { getUserId } from "#app/utils/auth.server.ts";

interface ActionData {
  errors: {
    password?: string;
    confirmPassword?: string;
  };
  fields?: {
    password?: string;
    confirmPassword?: string;
  };
  formMessage?: {
    type: "success" | "error";
    message: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  if (typeof password !== "string") {
    return json<ActionData>(
      { errors: { password: "Password is required" } },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return json<ActionData>(
      { errors: { password: "Password is too short" } },
      { status: 400 }
    );
  }

  if (password !== confirmPassword) {
    return json<ActionData>(
      { errors: { confirmPassword: "Passwords do not match" } },
      { status: 400 }
    );
  }

  const userId = await getUserId(request);
  if (typeof userId !== "string") {
    return json<ActionData>(
      { errors: { password: "User is not logged in" } },
      { status: 400 }
    );
  }
  await updateUserPassword(userId, password);
  return json({
    fields: { password: "", confirmPassword: "" },
    formMessage: { type: "success", message: "Password updated" },
  });
};

export default function SettingsSecurityPage() {
  const actionData = useActionData<ActionData>();
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    } else if (actionData?.errors?.confirmPassword) {
      confirmPasswordRef.current?.focus();
    }

    if (actionData?.fields?.password === "" && passwordRef.current) {
      passwordRef.current.value = "";
    }
    if (
      actionData?.fields?.confirmPassword === "" &&
      confirmPasswordRef.current
    ) {
      confirmPasswordRef.current.value = "";
    }
  }, [ actionData ]);

  return (
    <>
      <h1 className="text-xl font-semibold">Security</h1>
      <p>
        Keep your account safe by changing your password. You can change your
        password at any time.
      </p>
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
                Password
              </label>
              <input
                id="password"
                ref={passwordRef}
                name="password"
                type="password"
                autoComplete="new-password"
                aria-invalid={actionData?.errors?.password ? true : undefined}
                aria-describedby="password-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              />
              {actionData?.errors?.password && (
                <div className="pt-1 text-red-700" id="password-error">
                  {actionData.errors.password}
                </div>
              )}
            </div>
          </div>
          <div className="mt-2 flex items-center gap-6">
            <div className="w-1/2">
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                ref={confirmPasswordRef}
                name="confirmPassword"
                type="password"
                autoComplete="confirm-password"
                aria-invalid={
                  actionData?.errors?.confirmPassword ? true : undefined
                }
                aria-describedby="confirm-password-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              />
              {actionData?.errors?.confirmPassword && (
                <div className="pt-1 text-red-700" id="confirm-password-error">
                  {actionData.errors.confirmPassword}
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 flex items-center gap-6">
            <div className="w-1/2">
              <button className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400">
                Change Password
              </button>
            </div>
          </div>
        </Form>
      </div>
    </>
  );
}
