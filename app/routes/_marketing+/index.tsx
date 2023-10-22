import { type ActionFunction, json } from '@remix-run/node';
import { Form, Link, useActionData } from '@remix-run/react';
import * as React from 'react';
import ExploringNewPlacesImg from '#app/assets/images/exploring-new-places.jpg';
// import { SuccessAlert } from "#app/components/ui/index.ts";
import { SuccessAlert } from '#app/components/ui/index.ts';
import { addSubscriber } from '#app/models/user.server.ts';
// import { useOptionalUser } from "#app/utils/user.ts";
import { validateEmail } from '#app/utils/utils.ts';

interface ActionData {
  errors: {
    firstName?: string;
    email?: string;
  };
  message?: string;
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const firstName = formData.get('firstName');
  const email = formData.get('email');

  if (typeof firstName !== 'string' || firstName.length < 2) {
    return json({
      errors: {
        firstName: 'First name is required',
      },
    });
  }

  if (!validateEmail(email)) {
    return json<ActionData>(
      {
        errors: { email: 'Please enter a valid email address' },
      },
      { status: 400 },
    );
  }

  const subscriber = await addSubscriber(firstName, email);
  if (!subscriber) {
    return json<ActionData>(
      {
        errors: {
          email: 'Subscriber already registered',
        },
      },
      { status: 400 },
    );
  }

  return json<ActionData>({
    message: 'You have been subscribed to updates',
    errors: {},
  });
};

export default function Index() {
  // const [ searchParams ] = useSearchParams();
  // const denied = searchParams.get("denied");
  // const user = useOptionalUser();
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
      nameRef.current.value = '';
      emailRef.current.value = '';
    }
  }, [actionData]);

  return (
    <main className="relative min-h-screen sm:flex sm:items-center sm:justify-center">
      <div className="relative sm:pb-16 sm:pt-8">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative shadow-xl sm:overflow-hidden sm:rounded-2xl">
            <div className="absolute inset-0">
              <img
                className="h-full w-full object-cover"
                src={ExploringNewPlacesImg}
                alt=""
              />
              <div className="absolute inset-0 bg-[color:rgba(30,23,38,0.5)] mix-blend-multiply" />
            </div>
            <div className="lg:pt-18 relative px-4 pb-8 pt-8 sm:px-6 sm:pb-14 sm:pt-16 lg:px-8 lg:pb-20">
              <h1 className="text-center text-mega font-extrabold tracking-tight sm:text-8xl lg:text-9xl">
                <span className="block uppercase text-white drop-shadow-md">
                  <span>Scout Challenge</span>
                  <svg
                    className="mx-auto mt-2"
                    xmlns="http://www.w3.org/2000/svg"
                    width="120"
                    height="120"
                    viewBox="0 0 401.294 401.294"
                  >
                    <path
                      d="m100 852.362-30 170 30 30v-200z"
                      style={{
                        fill: '#000',
                        fillOpacity: 1,
                        fillRule: 'evenodd',
                        stroke: '#000',
                        strokeWidth: '2.22388315px',
                        strokeLinecap: 'butt',
                        strokeLinejoin: 'miter',
                        strokeOpacity: 1,
                      }}
                      transform="scale(.44966) rotate(-22.5 -1251.962 -120.75)"
                    />
                    <path
                      d="m99.962 852.362 30 170-30 30v-200z"
                      style={{
                        fill: '#fff',
                        fillOpacity: 1,
                        fillRule: 'evenodd',
                        stroke: '#000',
                        strokeWidth: '2.22388315px',
                        strokeLinecap: 'butt',
                        strokeLinejoin: 'miter',
                        strokeOpacity: 1,
                      }}
                      transform="scale(.44966) rotate(-22.5 -1251.962 -120.75)"
                    />
                    <path
                      d="m99.962 1253.482 30-170-30-30v200z"
                      style={{
                        fill: '#000',
                        fillOpacity: 1,
                        fillRule: 'evenodd',
                        stroke: '#000',
                        strokeWidth: '2.22388315px',
                        strokeLinecap: 'butt',
                        strokeLinejoin: 'miter',
                        strokeOpacity: 1,
                      }}
                      transform="scale(.44966) rotate(-22.5 -1251.962 -120.75)"
                    />
                    <path
                      d="m100 1253.482-30-170 30-30v200z"
                      style={{
                        fill: '#fff',
                        fillOpacity: 1,
                        fillRule: 'evenodd',
                        stroke: '#000',
                        strokeWidth: '2.22388315px',
                        strokeLinecap: 'butt',
                        strokeLinejoin: 'miter',
                        strokeOpacity: 1,
                      }}
                      transform="scale(.44966) rotate(-22.5 -1251.962 -120.75)"
                    />
                    <path
                      d="m300.541 1052.941-170-30-30 30h200z"
                      style={{
                        fill: '#000',
                        fillOpacity: 1,
                        fillRule: 'evenodd',
                        stroke: '#000',
                        strokeWidth: '2.22388315px',
                        strokeLinecap: 'butt',
                        strokeLinejoin: 'miter',
                        strokeOpacity: 1,
                      }}
                      transform="scale(.44966) rotate(-22.5 -1251.962 -120.75)"
                    />
                    <path
                      d="m300.541 1052.903-170 30-30-30h200z"
                      style={{
                        fill: '#fff',
                        fillOpacity: 1,
                        fillRule: 'evenodd',
                        stroke: '#000',
                        strokeWidth: '2.22388315px',
                        strokeLinecap: 'butt',
                        strokeLinejoin: 'miter',
                        strokeOpacity: 1,
                      }}
                      transform="scale(.44966) rotate(-22.5 -1251.962 -120.75)"
                    />
                    <path
                      d="m-100.579 1052.903 170 30 30-30h-200z"
                      style={{
                        fill: '#000',
                        fillOpacity: 1,
                        fillRule: 'evenodd',
                        stroke: '#000',
                        strokeWidth: '2.22388315px',
                        strokeLinecap: 'butt',
                        strokeLinejoin: 'miter',
                        strokeOpacity: 1,
                      }}
                      transform="scale(.44966) rotate(-22.5 -1251.962 -120.75)"
                    />
                    <path
                      d="m-100.579 1052.941 170-30 30 30h-200z"
                      style={{
                        fill: '#fff',
                        fillOpacity: 1,
                        fillRule: 'evenodd',
                        stroke: '#000',
                        strokeWidth: '2.22388315px',
                        strokeLinecap: 'butt',
                        strokeLinejoin: 'miter',
                        strokeOpacity: 1,
                      }}
                      transform="scale(.44966) rotate(-22.5 -1251.962 -120.75)"
                    />
                    <path
                      d="m100 852.362-30 170 30 30v-200z"
                      style={{
                        fill: '#000',
                        fillOpacity: 1,
                        fillRule: 'evenodd',
                        stroke: '#000',
                        strokeWidth: '2.22388315px',
                        strokeLinecap: 'butt',
                        strokeLinejoin: 'miter',
                        strokeOpacity: 1,
                      }}
                      transform="scale(.44966) rotate(-67.5 -180.902 490.48)"
                    />
                    <path
                      d="m99.962 852.362 30 170-30 30v-200z"
                      style={{
                        fill: '#fff',
                        fillOpacity: 1,
                        fillRule: 'evenodd',
                        stroke: '#000',
                        strokeWidth: '2.22388315px',
                        strokeLinecap: 'butt',
                        strokeLinejoin: 'miter',
                        strokeOpacity: 1,
                      }}
                      transform="scale(.44966) rotate(-67.5 -180.902 490.48)"
                    />
                    <path
                      d="m99.962 1253.482 30-170-30-30v200z"
                      style={{
                        fill: '#000',
                        fillOpacity: 1,
                        fillRule: 'evenodd',
                        stroke: '#000',
                        strokeWidth: '2.22388315px',
                        strokeLinecap: 'butt',
                        strokeLinejoin: 'miter',
                        strokeOpacity: 1,
                      }}
                      transform="scale(.44966) rotate(-67.5 -180.902 490.48)"
                    />
                    <path
                      d="m100 1253.482-30-170 30-30v200z"
                      style={{
                        fill: '#fff',
                        fillOpacity: 1,
                        fillRule: 'evenodd',
                        stroke: '#000',
                        strokeWidth: '2.22388315px',
                        strokeLinecap: 'butt',
                        strokeLinejoin: 'miter',
                        strokeOpacity: 1,
                      }}
                      transform="scale(.44966) rotate(-67.5 -180.902 490.48)"
                    />
                    <path
                      d="m300.541 1052.941-170-30-30 30h200z"
                      style={{
                        fill: '#000',
                        fillOpacity: 1,
                        fillRule: 'evenodd',
                        stroke: '#000',
                        strokeWidth: '2.22388315px',
                        strokeLinecap: 'butt',
                        strokeLinejoin: 'miter',
                        strokeOpacity: 1,
                      }}
                      transform="scale(.44966) rotate(-67.5 -180.902 490.48)"
                    />
                    <path
                      d="m300.541 1052.903-170 30-30-30h200z"
                      style={{
                        fill: '#fff',
                        fillOpacity: 1,
                        fillRule: 'evenodd',
                        stroke: '#000',
                        strokeWidth: '2.22388315px',
                        strokeLinecap: 'butt',
                        strokeLinejoin: 'miter',
                        strokeOpacity: 1,
                      }}
                      transform="scale(.44966) rotate(-67.5 -180.902 490.48)"
                    />
                    <path
                      d="m-100.579 1052.903 170 30 30-30h-200z"
                      style={{
                        fill: '#000',
                        fillOpacity: 1,
                        fillRule: 'evenodd',
                        stroke: '#000',
                        strokeWidth: '2.22388315px',
                        strokeLinecap: 'butt',
                        strokeLinejoin: 'miter',
                        strokeOpacity: 1,
                      }}
                      transform="scale(.44966) rotate(-67.5 -180.902 490.48)"
                    />
                    <path
                      d="m-100.579 1052.941 170-30 30 30h-200z"
                      style={{
                        fill: '#fff',
                        fillOpacity: 1,
                        fillRule: 'evenodd',
                        stroke: '#000',
                        strokeWidth: '2.22388315px',
                        strokeLinecap: 'butt',
                        strokeLinejoin: 'miter',
                        strokeOpacity: 1,
                      }}
                      transform="scale(.44966) rotate(-67.5 -180.902 490.48)"
                    />
                    <path
                      d="M100 37.15A162.85 162.85 0 0 0-62.85 200 162.85 162.85 0 0 0 100 362.85 162.85 162.85 0 0 0 262.85 200 162.85 162.85 0 0 0 100 37.15Zm0 28.35A134.5 134.5 0 0 1 234.5 200 134.5 134.5 0 0 1 100 334.5 134.5 134.5 0 0 1-34.5 200 134.5 134.5 0 0 1 100 65.5Z"
                      style={{
                        opacity: 1,
                        fill: '#000',
                        fillOpacity: 1,
                        stroke: '#000',
                        strokeWidth: 1,
                        strokeMiterlimit: 4,
                        strokeDasharray: 'none',
                        strokeOpacity: 1,
                      }}
                      transform="translate(100.666 .087)"
                    />
                    <path
                      d="m185.055 967.864-84.828 59.38v25.449l84.828-84.829z"
                      style={{
                        fill: '#000',
                        fillOpacity: 1,
                        fillRule: 'evenodd',
                        stroke: '#000',
                        strokeWidth: '1px',
                        strokeLinecap: 'butt',
                        strokeLinejoin: 'miter',
                        strokeOpacity: 1,
                      }}
                      transform="translate(100.666 -852.275)"
                    />
                    <path
                      d="m185.04 967.848-59.38 84.829h-25.45l84.83-84.829z"
                      style={{
                        fill: '#fff',
                        fillOpacity: 1,
                        fillRule: 'evenodd',
                        stroke: '#000',
                        strokeWidth: '1px',
                        strokeLinecap: 'butt',
                        strokeLinejoin: 'miter',
                        strokeOpacity: 1,
                      }}
                      transform="translate(100.666 -852.275)"
                    />
                    <path
                      d="m14.907 1137.98 84.829-59.38v-25.448l-84.829 84.828z"
                      style={{
                        fill: '#000',
                        fillOpacity: 1,
                        fillRule: 'evenodd',
                        stroke: '#000',
                        strokeWidth: '1px',
                        strokeLinecap: 'butt',
                        strokeLinejoin: 'miter',
                        strokeOpacity: 1,
                      }}
                      transform="translate(100.666 -852.275)"
                    />
                    <path
                      d="m14.923 1137.996 59.38-84.828h25.449l-84.829 84.828z"
                      style={{
                        fill: '#fff',
                        fillOpacity: 1,
                        fillRule: 'evenodd',
                        stroke: '#000',
                        strokeWidth: '1px',
                        strokeLinecap: 'butt',
                        strokeLinejoin: 'miter',
                        strokeOpacity: 1,
                      }}
                      transform="translate(100.666 -852.275)"
                    />
                    <path
                      d="m185.04 1137.996-59.38-84.828h-25.45l84.83 84.828z"
                      style={{
                        fill: '#000',
                        fillOpacity: 1,
                        fillRule: 'evenodd',
                        stroke: '#000',
                        strokeWidth: '1px',
                        strokeLinecap: 'butt',
                        strokeLinejoin: 'miter',
                        strokeOpacity: 1,
                      }}
                      transform="translate(100.666 -852.275)"
                    />
                    <path
                      d="m185.055 1137.98-84.828-59.38v-25.448l84.828 84.828z"
                      style={{
                        fill: '#fff',
                        fillOpacity: 1,
                        fillRule: 'evenodd',
                        stroke: '#000',
                        strokeWidth: '1px',
                        strokeLinecap: 'butt',
                        strokeLinejoin: 'miter',
                        strokeOpacity: 1,
                      }}
                      transform="translate(100.666 -852.275)"
                    />
                    <path
                      d="m14.923 967.848 59.38 84.829h25.449l-84.829-84.829z"
                      style={{
                        fill: '#000',
                        fillOpacity: 1,
                        fillRule: 'evenodd',
                        stroke: '#000',
                        strokeWidth: '1px',
                        strokeLinecap: 'butt',
                        strokeLinejoin: 'miter',
                        strokeOpacity: 1,
                      }}
                      transform="translate(100.666 -852.275)"
                    />
                    <path
                      d="m14.907 967.864 84.829 59.38v25.449l-84.829-84.829z"
                      style={{
                        fill: '#fff',
                        fillOpacity: 1,
                        fillRule: 'evenodd',
                        stroke: '#000',
                        strokeWidth: '1px',
                        strokeLinecap: 'butt',
                        strokeLinejoin: 'miter',
                        strokeOpacity: 1,
                      }}
                      transform="translate(100.666 -852.275)"
                    />
                    <path
                      d="m100 852.362-30 170 30 30v-200z"
                      style={{
                        fill: '#000',
                        fillOpacity: 1,
                        fillRule: 'evenodd',
                        stroke: '#000',
                        strokeWidth: '1px',
                        strokeLinecap: 'butt',
                        strokeLinejoin: 'miter',
                        strokeOpacity: 1,
                      }}
                      transform="translate(100.666 -852.275)"
                    />
                    <path
                      d="m99.962 852.362 30 170-30 30v-200z"
                      style={{
                        fill: '#fff',
                        fillOpacity: 1,
                        fillRule: 'evenodd',
                        stroke: '#000',
                        strokeWidth: '1px',
                        strokeLinecap: 'butt',
                        strokeLinejoin: 'miter',
                        strokeOpacity: 1,
                      }}
                      transform="translate(100.666 -852.275)"
                    />
                    <path
                      d="m99.962 1253.482 30-170-30-30v200z"
                      style={{
                        fill: '#000',
                        fillOpacity: 1,
                        fillRule: 'evenodd',
                        stroke: '#000',
                        strokeWidth: '1px',
                        strokeLinecap: 'butt',
                        strokeLinejoin: 'miter',
                        strokeOpacity: 1,
                      }}
                      transform="translate(100.666 -852.275)"
                    />
                    <path
                      d="m100 1253.482-30-170 30-30v200z"
                      style={{
                        fill: '#fff',
                        fillOpacity: 1,
                        fillRule: 'evenodd',
                        stroke: '#000',
                        strokeWidth: '1px',
                        strokeLinecap: 'butt',
                        strokeLinejoin: 'miter',
                        strokeOpacity: 1,
                      }}
                      transform="translate(100.666 -852.275)"
                    />
                    <path
                      d="m300.541 1052.941-170-30-30 30h200z"
                      style={{
                        fill: '#000',
                        fillOpacity: 1,
                        fillRule: 'evenodd',
                        stroke: '#000',
                        strokeWidth: '1px',
                        strokeLinecap: 'butt',
                        strokeLinejoin: 'miter',
                        strokeOpacity: 1,
                      }}
                      transform="translate(100.666 -852.275)"
                    />
                    <path
                      d="m300.541 1052.903-170 30-30-30h200z"
                      style={{
                        fill: '#fff',
                        fillOpacity: 1,
                        fillRule: 'evenodd',
                        stroke: '#000',
                        strokeWidth: '1px',
                        strokeLinecap: 'butt',
                        strokeLinejoin: 'miter',
                        strokeOpacity: 1,
                      }}
                      transform="translate(100.666 -852.275)"
                    />
                    <path
                      d="m-100.579 1052.903 170 30 30-30h-200z"
                      style={{
                        fill: '#000',
                        fillOpacity: 1,
                        fillRule: 'evenodd',
                        stroke: '#000',
                        strokeWidth: '1px',
                        strokeLinecap: 'butt',
                        strokeLinejoin: 'miter',
                        strokeOpacity: 1,
                      }}
                      transform="translate(100.666 -852.275)"
                    />
                    <path
                      d="m-100.579 1052.941 170-30 30 30h-200z"
                      style={{
                        fill: '#fff',
                        fillOpacity: 1,
                        fillRule: 'evenodd',
                        stroke: '#000',
                        strokeWidth: '1px',
                        strokeLinecap: 'butt',
                        strokeLinejoin: 'miter',
                        strokeOpacity: 1,
                      }}
                      transform="translate(100.666 -852.275)"
                    />
                  </svg>
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-lg text-center text-xl text-white sm:max-w-3xl">
                Check the{' '}
                <Link className="underline" to="/about">
                  about
                </Link>{' '}
                page to find out how you can keep the adventure alive even when
                you're not there.
              </p>
            </div>
          </div>
        </div>

        <div className="container mt-8 flex flex-col items-center text-center">
          <h1 className="mb-4 text-3xl font-medium sm:text-4xl">
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
                  className="w-full rounded border border-gray-300 bg-gray-100 bg-opacity-50 px-3 py-1 text-base leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200"
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
                  className="w-full rounded border border-gray-300 bg-gray-100 bg-opacity-50 px-3 py-1 text-base leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200"
                />
              </div>
              <button
                type="submit"
                className="inline-flex whitespace-nowrap rounded border-0 bg-indigo-500 px-6 py-2 text-lg text-white hover:bg-indigo-600 focus:outline-none"
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

          <p className="mb-8 mt-2 w-full text-sm text-gray-500">
            We won't send you spam and we'll never share your email address.
          </p>
        </div>
      </div>
    </main>
  );
}
