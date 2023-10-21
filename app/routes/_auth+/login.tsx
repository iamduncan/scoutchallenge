import { conform, useForm } from '@conform-to/react';
import { getFieldsetConstraint, parse } from "@conform-to/zod";
import {
  type MetaFunction,
  json, redirect, type LoaderFunctionArgs, type DataFunctionArgs
} from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { AuthenticityTokenInput } from 'remix-utils/csrf/react';
import { HoneypotInputs } from "remix-utils/honeypot/react";
import { safeRedirect } from 'remix-utils/safe-redirect';
import { z } from 'zod';
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx';
import { CheckboxField, ErrorList, Field } from '#app/components/forms.tsx';
import { StatusButton } from '#app/components/ui/status-button.tsx';
import { getUserId, login, requireAnonymous, sessionKey } from '#app/utils/auth.server.ts';
import { ProviderConnectionForm, providerNames } from '#app/utils/connections.tsx';
import { validateCSRF } from '#app/utils/csrf.server.ts';
import { prisma } from '#app/utils/db.server.ts';
import { checkHoneypot } from '#app/utils/honeypot.server.ts';
import { combineResponseInits, invariant, useIsPending } from '#app/utils/misc.tsx';
import { authSessionStorage } from '#app/utils/session.server.ts';
import { redirectWithToast } from '#app/utils/toast.server.ts';
import { PasswordSchema, UsernameSchema } from '#app/utils/user-validation.ts';
import { verifySessionStorage } from '#app/utils/verification.server.ts';
import { twoFAVerificationType } from '../_app+/settings+/profile.two-factor.tsx';
import { type VerifyFunctionArgs, getRedirectToUrl } from './verify.tsx';

const verifiedTimeKey = 'verified-time';
const unverifiedSessionIdKey = 'unverified-session-id';
const rememberKey = 'remember';

export async function handleNewSession(
  {
    request,
    session,
    redirectTo,
    remember,
  }: {
    request: Request;
    session: { userId: string; id: string; expirationDate: Date };
    redirectTo?: string;
    remember: boolean;
  },
  responseInit?: ResponseInit,
) {
  const verification = await prisma.verification.findUnique({
    select: { id: true },
    where: {
      target_type: { target: session.userId, type: twoFAVerificationType },
    },
  })
  const userHasTwoFactor = Boolean(verification);

  if (userHasTwoFactor) {
    const verifySession = await verifySessionStorage.getSession();
    verifySession.set(unverifiedSessionIdKey, session.id);
    verifySession.set(rememberKey, remember);
    const redirectUrl = getRedirectToUrl({
      request,
      type: twoFAVerificationType,
      target: session.userId,
      redirectTo,
    });
    return redirect(
      `${redirectUrl}?${redirectUrl.searchParams}`,
      combineResponseInits(
        {
          headers: {
            'set-cookie': await verifySessionStorage.commitSession(verifySession),
          },
        },
        responseInit,
      ),
    );
  } else {
    const authSession = await authSessionStorage.getSession(
      request.headers.get('cookie'),
    );
    authSession.set(sessionKey, session.id);
    return redirect(
      safeRedirect(redirectTo || '/challenges'),
      combineResponseInits(
        {
          headers: {
            'set-cookie': await authSessionStorage.commitSession(authSession, {
              expires: remember ? session.expirationDate : undefined,
            }),
          },
        },
        responseInit,
      ),
    )
  }
}

export async function handleVerification({
  request,
  submission,
}: VerifyFunctionArgs) {
  invariant(submission.value, 'Submission value should have a value');
  const authSession = await authSessionStorage.getSession(
    request.headers.get('cookie'),
  );
  const verifySession = await verifySessionStorage.getSession(
    request.headers.get('cookie'),
  );

  const remember = verifySession.get(rememberKey);
  const { redirectTo } = submission.value;
  const headers = new Headers();
  authSession.set(verifiedTimeKey, Date.now());

  const unverifiedSessionId = verifySession.get(unverifiedSessionIdKey);
  if (unverifiedSessionId) {
    const session = await prisma.session.findUnique({
      select: { expirationDate: true },
      where: { id: unverifiedSessionId },
    });
    if (!session) {
      throw await redirectWithToast('/login', {
        type: 'error',
        title: 'Invalid session',
        description: 'Could not find the session to verify. Please try again.',
      });
    }
    authSession.set(sessionKey, unverifiedSessionId);

    headers.append(
      'set-cookie',
      await authSessionStorage.commitSession(authSession, {
        expires: remember ? session.expirationDate : undefined,
      }),
    );
  } else {

    headers.append(
      'set-cookie',
      await verifySessionStorage.destroySession(verifySession),
    );

    return redirect(safeRedirect(redirectTo), { headers });
  }
}

export async function shouldRequestTwoFA(request: Request) {
  const authSession = await authSessionStorage.getSession(
    request.headers.get('cookie'),
  );
  const verifySession = await verifySessionStorage.getSession(
    request.headers.get('cookie'),
  );
  if (verifySession.has(unverifiedSessionIdKey)) return true;
  const userId = await getUserId(request);
  if (!userId) return false;
  const userHasTwoFA = await prisma.verification.findUnique({
    select: { id: true },
    where: {
      target_type: { target: userId, type: twoFAVerificationType },
    },
  });
  if (!userHasTwoFA) return false;
  const verifiedTime = authSession.get(verifiedTimeKey) ?? new Date(0);
  const twoHours = 2 * 60 * 60 * 1000;
  return Date.now() - verifiedTime.getTime() > twoHours;
}

const LoginFormSchema = z.object({
  username: UsernameSchema,
  password: PasswordSchema,
  redirectTo: z.string().optional(),
  remember: z.boolean().optional(),
});

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireAnonymous(request);
  return json({});
};

export const action = async ({ request }: DataFunctionArgs) => {
  await requireAnonymous(request);
  const formData = await request.formData();
  await validateCSRF(formData, request.headers);
  checkHoneypot(formData);
  const submission = await parse(formData, {
    schema: intent => LoginFormSchema.transform(async (data, ctx) => {
      if (intent !== 'submit') return { ...data, session: null };

      const session = await login(data);
      if (!session) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Invalid username or password',
        });
        return z.NEVER;
      }

      return { ...data, session };
    }),
    async: true,
  });
  // remove the password from the payload before we send it to the client
  delete submission.payload.password;

  if (submission.intent !== 'submit') {
    // @ts-expect-error
    delete submission.value?.password;
    return json({ status: 'idle', submission } as const, { status: 400 });
  }
  if (!submission.value?.session) {
    return json({ status: 'error', submission } as const, { status: 400 });
  }

  const { session, remember, redirectTo } = submission.value;

  return handleNewSession({
    request,
    session,
    remember: remember ?? false,
    redirectTo,
  });
};

export default function LoginPage() {
  const actionData = useActionData<typeof action>();
  const isPending = useIsPending();
  const [ searchParams ] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/challenges";

  const [ form, fields ] = useForm({
    id: 'login-form',
    constraint: getFieldsetConstraint(LoginFormSchema),
    defaultValue: { redirectTo },
    lastSubmission: actionData?.submission,
    onValidate({ formData }) {
      return parse(formData, { schema: LoginFormSchema })
    },
    shouldRevalidate: 'onBlur',
  });

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
        <Form method="post" className="space-y-6" {...form.props}>
          <div>
            <div className="mt-1">
              <AuthenticityTokenInput />
              <HoneypotInputs />
              <Field
                labelProps={{ children: 'Username' }}
                inputProps={{
                  ...conform.input(fields.username),
                  autoFocus: true,
                  className: 'lowercase',
                }}
                errors={fields.username.errors}
              />
            </div>
          </div>

          <div>
            <Field
              labelProps={{ children: 'Password' }}
              inputProps={conform.input(fields.password, { type: 'password' })}
              errors={fields.password.errors}
            />
          </div>
          <div>
            <div className="flex items-center">
              <CheckboxField
                labelProps={{
                  htmlFor: fields.remember.id,
                  children: 'Remember me',
                }}
                buttonProps={conform.input(fields.remember, {
                  type: 'checkbox',
                })}
                errors={fields.remember.errors}
              />
            </div>
          </div>

          <input {...conform.input(fields.redirectTo, { type: 'hidden' })} />
          <ErrorList errors={form.errors} id={form.errorId} />

          <StatusButton
            className='w-full'
            status={isPending ? 'pending' : actionData?.status ?? 'idle'}
            type='submit'
            disabled={isPending}
          >
            Log in
          </StatusButton>

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
        <ul className="mt-5 flex flex-col gap-5 border-b-2 border-t-2 border-border py-3">
          {providerNames.map(providerName => (
            <li key={providerName}>
              <ProviderConnectionForm
                type="Login"
                providerName={providerName}
                redirectTo={redirectTo}
              />
            </li>
          ))}
        </ul>
      </div>
      <div className="absolute top-4 left-4">
        <Link to="/" className="hover:text-blue-500 hover:underline">
          &larr; Go Home
        </Link>
      </div>
    </div>
  );
}

export const meta: MetaFunction = () => {
  return [ { title: "Login", } ];
};

export function ErrorBoundary() {
  return <GeneralErrorBoundary />;
}
