import {
  type ActionFunction,
  type LoaderFunction,
  type MetaFunction,
  json, redirect
} from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import * as React from "react";

import { verifyLogin } from "#app/models/user.server.ts";
import { requireUserId } from '#app/utils/auth.server.ts';
import { validateEmail } from "#app/utils/utils.ts";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);
  return json({});
};

interface ActionData {
  errors?: {
    email?: string;
    password?: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  if (!validateEmail(email)) {
    return json<ActionData>(
      { errors: { email: "Email is invalid" } },
      { status: 400 },
    );
  }

  if (typeof password !== "string") {
    return json<ActionData>(
      { errors: { password: "Password is required" } },
      { status: 400 },
    );
  }

  if (password.length < 8) {
    return json<ActionData>(
      { errors: { password: "Password is too short" } },
      { status: 400 },
    );
  }

  const user = await verifyLogin(email, password);

  if (!user) {
    return json<ActionData>(
      { errors: { email: "Invalid email or password" } },
      { status: 400 },
    );
  }

  return redirect("/");
  // return createUserSession({
  //   request,
  //   userId: user.id,
  //   remember: remember === "on" ? true : false,
  //   redirectTo: typeof redirectTo === "string" ? redirectTo : "/challenges",
  // });
};

export const meta: MetaFunction = () => {
  return [
    {
      title: "Login",
    },
  ];
};

export default function LoginPage() {
  const [ searchParams ] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/challenges";
  const actionData = useActionData() as ActionData;
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [ actionData ]);

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        {searchParams.get("success") && (
          <div className="mb-8 w-full text-center">
            <div
              className="mt-6 flex items-center justify-between gap-4 rounded border border-green-900/10 bg-green-50 p-4 text-green-700"
              role="alert"
            >
              <div className="flex w-full items-center gap-4">
                <span className="rounded-full bg-green-600 p-2 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </span>

                <p className="flex-grow">
                  <strong className="text-sm font-medium"> Success! </strong>

                  <span className="block text-xs opacity-90">
                    {searchParams.get("success") === "password-reset" &&
                      "Password reset has been sent, please check your email."}
                    {searchParams.get("success") === "password-updated" &&
                      "Password has been updated, please login."}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
        <Form method="post" className="space-y-6" noValidate>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <div className="mt-1">
              <input
                ref={emailRef}
                id="email"
                required
                autoFocus={true}
                name="email"
                type="email"
                autoComplete="email"
                aria-invalid={actionData?.errors?.email ? true : undefined}
                aria-describedby="email-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              />
              {actionData?.errors?.email && (
                <div className="pt-1 text-red-700" id="email-error">
                  {actionData.errors.email}
                </div>
              )}
            </div>
          </div>

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
                autoComplete="current-password"
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
          <div>
            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="remember"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>
          </div>

          <input type="hidden" name="redirectTo" value={redirectTo} />
          <button
            type="submit"
            className="w-full rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Log in
          </button>
          <div className="flex items-center justify-between">
            <div className="text-center text-sm text-gray-500">
              <Link
                className="text-blue-500 underline"
                to="/forgotten-password"
              >
                Forgot password?
              </Link>
            </div>
            <div className="text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                className="text-blue-500 underline"
                to={{
                  pathname: "/join",
                  search: searchParams.toString(),
                }}
              >
                Sign up
              </Link>
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
