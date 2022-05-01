import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { useOptionalUser, validateEmail } from "~/utils";
import * as React from "react";

import ExploringNewPlacesImg from "~/assets/images/exploring-new-places.jpg";
import type { ActionFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { addSubscriber } from "~/models/user.server";
import { SuccessAlert } from "~/components/ui";

interface ActionData {
  errors: {
    firstName?: string;
    email?: string;
  };
  message?: string;
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const firstName = formData.get("firstName");
  const email = formData.get("email");

  if (typeof firstName !== "string" || firstName.length < 2) {
    return json({
      errors: {
        firstName: "First name is required",
      },
    });
  }

  if (!validateEmail(email)) {
    return json<ActionData>(
      {
        errors: { email: "Please enter a valid email address" },
      },
      { status: 400 }
    );
  }

  const subscriber = await addSubscriber(firstName, email);
  if (!subscriber) {
    return json<ActionData>(
      {
        errors: {
          email: "Subscriber already registered",
        },
      },
      { status: 400 }
    );
  }

  return json<ActionData>({
    message: "You have been subscribed to updates",
    errors: {},
  });
};

export default function Index() {
  const [searchParams] = useSearchParams();
  const denied = searchParams.get("denied");
  const user = useOptionalUser();
  const actionData = useActionData<ActionData>();
  const nameRef = React.useRef<HTMLInputElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.firstName) {
      nameRef.current?.focus();
    } else if (actionData?.errors?.email) {
      emailRef.current?.focus();
    }
    if (actionData?.message && nameRef.current && emailRef.current) {
      nameRef.current.value = "";
      emailRef.current.value = "";
    }
  }, [actionData]);

  return (
    <main className="relative min-h-screen bg-white sm:items-center sm:justify-center">
      {denied && (
        <div className="absolute top-0 right-0 z-50 mt-4 mr-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700 shadow">
          <p className="font-bold">Access denied</p>
          <p>
            {denied === "admin" &&
              "You need to be an admin to access this page."}
            <Link to="/login">Log in</Link>
          </p>
        </div>
      )}
      <section className="text-center">
        <h1 className="my-8 text-center text-6xl font-bold text-purple-800">
          Scout Challenge
        </h1>
      </section>
      <section className="body-font text-gray-600">
        <div className="container mx-auto flex flex-col items-center px-5 md:flex-row md:py-14">
          <div className="mb-10 w-5/6 md:mb-0 md:w-1/2 lg:w-full lg:max-w-lg">
            <img
              className="rounded-lg object-cover object-center drop-shadow-2xl"
              alt="hero"
              src={ExploringNewPlacesImg}
            />
          </div>
          <div className="flex flex-col items-center text-center md:w-1/2 md:items-start md:pl-16 md:text-left lg:flex-grow lg:pl-24">
            <h1 className="title-font mb-4 text-3xl font-medium text-gray-900 sm:text-4xl">
              Keep the adventure alive even when you're not there.
            </h1>
            <p className="mb-8 leading-relaxed">
              Using our platform, you can create and share your own adventure.
              Encourage your young people to continue the adventure.
            </p>
            {actionData?.message && (
              <SuccessAlert>{actionData.message}</SuccessAlert>
            )}
            <div className="mb-4 leading-relaxed">
              Sign up now to find out when when are ready to launch.
            </div>
            <Form method="post" className="w-full">
              <div className="flex w-full flex-col items-center justify-center gap-2 md:flex-row md:justify-start">
                <div className="relative w-4/5 lg:w-full xl:w-1/3">
                  <label htmlFor="hero-field" className="hidden">
                    First Name
                  </label>
                  <input
                    placeholder="First Name"
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    autoComplete="given-name"
                    ref={nameRef}
                    aria-invalid={
                      actionData?.errors?.firstName ? true : undefined
                    }
                    aria-describedby="firstName-error"
                    className="w-full rounded border border-gray-300 bg-gray-100 bg-opacity-50 py-1 px-3 text-base leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200"
                  />
                </div>
                <div className="relative w-4/5 lg:w-full xl:w-1/3">
                  <label htmlFor="hero-field" className="hidden">
                    Email Address
                  </label>
                  <input
                    placeholder="Email"
                    type="email"
                    id="email"
                    name="email"
                    required
                    autoComplete="email"
                    ref={emailRef}
                    aria-invalid={actionData?.errors?.email ? true : undefined}
                    aria-describedby="email-error"
                    className="w-full rounded border border-gray-300 bg-gray-100 bg-opacity-50 py-1 px-3 text-base leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex rounded border-0 bg-indigo-500 py-2 px-6 text-lg text-white hover:bg-indigo-600 focus:outline-none"
                >
                  Sign Up
                </button>
              </div>
              {actionData?.errors?.firstName && (
                <div className="pt-1 text-red-700" id="firstName-error">
                  {actionData.errors.firstName}
                </div>
              )}
              {actionData?.errors?.email && (
                <div className="pt-1 text-red-700" id="email-error">
                  {actionData.errors.email}
                </div>
              )}
            </Form>

            <p className="mt-2 mb-8 w-full text-sm text-gray-500">
              We won't send you spam and we'll never share your email address.
            </p>
            {/* <div className="flex md:flex-col lg:flex-row">
              <button className="inline-flex items-center rounded-lg bg-gray-100 py-3 px-5 hover:bg-gray-200 focus:outline-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="h-6 w-6"
                  viewBox="0 0 512 512"
                >
                  <path d="M99.617 8.057a50.191 50.191 0 00-38.815-6.713l230.932 230.933 74.846-74.846L99.617 8.057zM32.139 20.116c-6.441 8.563-10.148 19.077-10.148 30.199v411.358c0 11.123 3.708 21.636 10.148 30.199l235.877-235.877L32.139 20.116zM464.261 212.087l-67.266-37.637-81.544 81.544 81.548 81.548 67.273-37.64c16.117-9.03 25.738-25.442 25.738-43.908s-9.621-34.877-25.749-43.907zM291.733 279.711L60.815 510.629c3.786.891 7.639 1.371 11.492 1.371a50.275 50.275 0 0027.31-8.07l266.965-149.372-74.849-74.847z"></path>
                </svg>
                <span className="ml-4 flex flex-col items-start leading-none">
                  <span className="mb-1 text-xs text-gray-600">GET IT ON</span>
                  <span className="title-font font-medium">Google Play</span>
                </span>
              </button>
              <button className="ml-4 mt-0 inline-flex items-center rounded-lg bg-gray-100 py-3 px-5 hover:bg-gray-200 focus:outline-none md:ml-0 md:mt-4 lg:ml-4 lg:mt-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="h-6 w-6"
                  viewBox="0 0 305 305"
                >
                  <path d="M40.74 112.12c-25.79 44.74-9.4 112.65 19.12 153.82C74.09 286.52 88.5 305 108.24 305c.37 0 .74 0 1.13-.02 9.27-.37 15.97-3.23 22.45-5.99 7.27-3.1 14.8-6.3 26.6-6.3 11.22 0 18.39 3.1 25.31 6.1 6.83 2.95 13.87 6 24.26 5.81 22.23-.41 35.88-20.35 47.92-37.94a168.18 168.18 0 0021-43l.09-.28a2.5 2.5 0 00-1.33-3.06l-.18-.08c-3.92-1.6-38.26-16.84-38.62-58.36-.34-33.74 25.76-51.6 31-54.84l.24-.15a2.5 2.5 0 00.7-3.51c-18-26.37-45.62-30.34-56.73-30.82a50.04 50.04 0 00-4.95-.24c-13.06 0-25.56 4.93-35.61 8.9-6.94 2.73-12.93 5.09-17.06 5.09-4.64 0-10.67-2.4-17.65-5.16-9.33-3.7-19.9-7.9-31.1-7.9l-.79.01c-26.03.38-50.62 15.27-64.18 38.86z"></path>
                  <path d="M212.1 0c-15.76.64-34.67 10.35-45.97 23.58-9.6 11.13-19 29.68-16.52 48.38a2.5 2.5 0 002.29 2.17c1.06.08 2.15.12 3.23.12 15.41 0 32.04-8.52 43.4-22.25 11.94-14.5 17.99-33.1 16.16-49.77A2.52 2.52 0 00212.1 0z"></path>
                </svg>
                <span className="ml-4 flex flex-col items-start leading-none">
                  <span className="mb-1 text-xs text-gray-600">
                    Download on the
                  </span>
                  <span className="title-font font-medium">App Store</span>
                </span>
              </button>
            </div> */}
          </div>
        </div>
      </section>
      <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
        {user ? (
          <Link
            to="/challenges"
            className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-blue-700 shadow-sm hover:bg-blue-50 sm:px-8"
          >
            View Challenges
          </Link>
        ) : (
          <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
            {/* <Link
              to="/join"
              className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-blue-700 shadow-sm hover:bg-blue-50 sm:px-8"
            >
              Sign up
            </Link>
            <Link
              to="/login"
              className="flex items-center justify-center rounded-md bg-blue-500 px-4 py-3 font-medium text-white hover:bg-blue-600  "
            >
              Log In
            </Link> */}
          </div>
        )}
      </div>
    </main>
  );
}
