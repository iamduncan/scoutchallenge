import {
  type ActionFunction,
  type LoaderFunction,
  type MetaFunction,
  json,
  redirect,
} from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { useEffect, useRef } from "react";

import FleurDeLisPurple from "#app/assets/images/fleur-de-lis-marque-purple.png";
import { createUser, getUserByEmail } from "#app/models/user.server.ts";
import { requireAnonymous } from "#app/utils/auth.server.ts";

import { validateEmail } from "#app/utils/utils.ts";

export const loader: LoaderFunction = async ({ request }) => {
  await requireAnonymous(request);
  return json({});
};

interface ActionData {
  errors: {
    email?: string;
    password?: string;
    confirmPassword?: string;
    first_name?: string;
    last_name?: string;
    group?: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");
  const first_name = formData.get("first_name");
  const last_name = formData.get("last_name");
  const group = formData.get("group");

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

  if (password !== confirmPassword) {
    return json<ActionData>(
      { errors: { confirmPassword: "Passwords do not match" } },
      { status: 400 },
    );
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return json<ActionData>(
      { errors: { email: "A user already exists with this email" } },
      { status: 400 },
    );
  }

  if (typeof first_name !== "string") {
    return json<ActionData>(
      { errors: { first_name: "First name is required" } },
      { status: 400 },
    );
  }

  if (typeof last_name !== "string") {
    return json<ActionData>(
      { errors: { last_name: "Last name is required" } },
      { status: 400 },
    );
  }

  if (typeof group !== "string") {
    return json<ActionData>(
      { errors: { group: "Group is required" } },
      { status: 400 },
    );
  }

  await createUser(email, password, first_name, last_name, group, "GROUPADMIN");

  return redirect("/login");
  // return createUserSession({
  //   request,
  //   userId: user.id,
  //   remember: false,
  //   redirectTo: typeof redirectTo === "string" ? redirectTo : "/",
  // });
};

export const meta: MetaFunction = () => {
  return [
    {
      title: "Sign Up",
    },
  ];
};

export default function Join() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
  const actionData = useActionData() as ActionData;
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const groupRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    } else if (actionData?.errors?.confirmPassword) {
      confirmPasswordRef.current?.focus();
    } else if (actionData?.errors?.group) {
      groupRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div
      className="flex min-h-full flex-col justify-center"
      suppressHydrationWarning
    >
      <div className="mx-auto w-full max-w-4xl px-8">
        <div className="flex justify-center">
          <img
            src={FleurDeLisPurple}
            alt="Fleur De Lis"
            className="mb-8 h-48"
          />
        </div>
        <div className="mb-8 w-full text-center">
          <p>Create an account for your group to get started.</p>
          <small>
            If your group already has an account, ask for an invite.
          </small>
        </div>
        <Form method="post" className="space-y-6" noValidate>
          <div className="gap-8 md:flex">
            <div className="w-full md:w-1/2">
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
            <div className="w-full md:w-1/2">
              <div>
                <label
                  htmlFor="first_name"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <div className="mt-1">
                  <input
                    id="first_name"
                    required
                    name="first_name"
                    type="text"
                    autoComplete="given-name"
                    aria-invalid={
                      actionData?.errors?.first_name ? true : undefined
                    }
                    aria-describedby="first-name-error"
                    className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
                  />
                  {actionData?.errors?.first_name && (
                    <div className="pt-1 text-red-700" id="first-name-error">
                      {actionData.errors.first_name}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="last_name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <div className="mt-1">
                  <input
                    id="last_name"
                    required
                    name="last_name"
                    type="text"
                    autoComplete="family-name"
                    aria-invalid={
                      actionData?.errors?.last_name ? true : undefined
                    }
                    aria-describedby="last-name-error"
                    className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
                  />
                  {actionData?.errors?.last_name && (
                    <div className="pt-1 text-red-700" id="last-name-error">
                      {actionData.errors.last_name}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="group"
                  className="block text-sm font-medium text-gray-700"
                >
                  Group Name
                </label>
                <div className="mt-1">
                  <input
                    id="group"
                    required
                    name="group"
                    type="text"
                    aria-invalid={actionData?.errors?.group ? true : undefined}
                    aria-describedby="group-error"
                    className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
                  />
                  {actionData?.errors?.group && (
                    <div className="pt-1 text-red-700" id="group-error">
                      {actionData.errors.group}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <input type="hidden" name="redirectTo" value={redirectTo} />
          <button
            type="submit"
            className="w-full rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Create Account
          </button>
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
                Already have an account?{" "}
                <Link
                  className="text-blue-500 underline"
                  to={{
                    pathname: "/login",
                    search: searchParams.toString(),
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
