import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import * as React from "react";
import { tokenIsValid, updateUserPassword } from "~/models/user.server";
import { getUserId } from "~/session.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const token = params.token;
  const validToken = await tokenIsValid(token as string);
  if (!validToken) {
    return redirect("/forgotten-password?error=invalid-token");
  }
  return json({});
};

interface ActionData {
  errors: {
    password?: string;
    confirmPassword?: string;
  };
}

export const action: ActionFunction = async ({ request, params }) => {
  const token = params.token;
  const validToken = await tokenIsValid(token as string);
  if (!validToken) {
    return redirect("/forgotten-password?error=invalid-token");
  }
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

  const userId = validToken.userId;
  if (typeof userId !== "string") {
    return json<ActionData>(
      { errors: { password: "User is not valid" } },
      { status: 400 }
    );
  }
  await updateUserPassword(userId, password, validToken.id);
  return redirect("/login?success=password-updated");
};

export default function ResetPassword() {
  const actionData = useActionData() as ActionData;
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const confirmPasswordRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    } else if (actionData?.errors?.confirmPassword) {
      confirmPasswordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-4xl px-8">
        <div className="mb-8 w-full text-center">
          <p>Enter a new password.</p>
        </div>
        <Form method="post" className="space-y-6" noValidate>
          <div className="justify-center gap-8 md:flex">
            <div className="w-full md:w-1/2">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    ref={passwordRef}
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    aria-invalid={
                      actionData?.errors?.password ? true : undefined
                    }
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
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <div className="mt-1">
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
                    <div
                      className="pt-1 text-red-700"
                      id="confirm-password-error"
                    >
                      {actionData.errors.confirmPassword}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full justify-center">
            <button
              type="submit"
              className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
            >
              Reset Password
            </button>
          </div>
          <div className="flex items-center justify-center">
            <div className="text-center text-sm text-gray-500">
              <p>
                Scout Challenge is not affiliated with the Scout Association,
                for more information about Scout Challenge, visit our{" "}
                <Link className="text-blue-500 underline" to="/support">
                  support section
                </Link>
                .
              </p>
              <p>
                <Link
                  className="text-blue-500 underline"
                  to={{
                    pathname: "/login",
                  }}
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </Form>
      </div>
      <div className="absolute top-4 left-4">
        <Link to="/" className="hover:text-blue-500 hover:underline">
          &larr; Go Home
        </Link>
      </div>
    </div>
  );
}
