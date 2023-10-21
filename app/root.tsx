import { parse } from '@conform-to/zod'
import {
  type LinksFunction,
  type LoaderFunctionArgs,
  type MetaFunction,
  json,
  type HeadersFunction,
  type DataFunctionArgs
} from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useFetchers,
  useLoaderData,
  // useMatches,
} from "@remix-run/react";
import { withSentry } from '@sentry/remix';
import { AuthenticityTokenProvider } from 'remix-utils/csrf/react';
import { HoneypotProvider } from 'remix-utils/honeypot/react';
import { z } from 'zod';
import editorStylesheetUrl from "./components/ui/Editor/styles.css";
import tailwindStylesheetUrl from "./styles/app.css";
import { getUserId } from "./utils/auth.server.ts";
import { ClientHintCheck, getHints, useHints } from './utils/client-hints.tsx';
import { getConfetti } from './utils/confetti.server.ts';
import { csrf } from './utils/csrf.server.ts';
import { prisma } from "./utils/db.server.ts";
import { getEnv } from './utils/env.server.ts';
import { honeypot } from './utils/honeypot.server.ts';
import { combineHeaders, getDomainUrl } from './utils/misc.tsx';
import { useNonce } from './utils/nonce-provider.ts';
import { useRequestInfo } from './utils/request-info.ts';
import { type Theme, getTheme, setTheme } from './utils/theme.server.ts';
import { makeTimings, time } from "./utils/timing.server.ts";
import { getToast } from './utils/toast.server.ts';
// import { useOptionalUser } from './utils/user.ts';

export const links: LinksFunction = () => {
  return [
    { rel: "preload", href: tailwindStylesheetUrl, as: "style" },
    { rel: "stylesheet", href: tailwindStylesheetUrl },
    { rel: "stylesheet", href: editorStylesheetUrl },
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com/",
      crossOrigin: "anonymous",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Nunito&display=swap",
    },
    {
      rel: "manifest",
      href: "/app.webmanifest",
    },
  ];
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data ? "Scout Challenge" : "Error | Scout Challenge" },
    { name: "description", content: "Scout Challenge" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const timings = makeTimings("root loader");
  const userId = await time(() => getUserId(request), {
    timings,
    type: "getUserId",
    desc: "getUserId in root",
  });

  const user = userId
    ? await time(
      () =>
        prisma.user.findUniqueOrThrow({
          select: {
            id: true,
            name: true,
            username: true,
            image: { select: { id: true } },
            roles: {
              select: {
                name: true,
                permissions: {
                  select: { entity: true, action: true, access: true },
                },
              },
            },
            groups: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          where: { id: userId },
        }),
      { timings, type: "find user", desc: "find user in root" },
    )
    : null;
  if (userId && !user) {
    console.info("something weird happened");
    // something weird happened... The user is authenticated but we can't find
    // them in the database. Maybe they were deleted? Let's log them out.
    // await authenticator.logout(request, { redirectTo: "/" });
  }
  const { toast, headers: toastHeaders } = await getToast(request);
  const { confettiId, headers: confettiHeaders } = await getConfetti(request);
  const honeyProps = honeypot.getInputProps();
  const [ csrfToken, csrfCookieHeader ] = await csrf.commitToken();

  return json({
    user,
    requestInfo: {
      hints: getHints(request),
      origin: getDomainUrl(request),
      path: new URL(request.url).pathname,
      userPrefs: {
        theme: getTheme(request),
      }
    },
    ENV: getEnv(),
    toast,
    confettiId,
    honeyProps,
    csrfToken,
  }, {
    headers: combineHeaders(
      { 'Server-Timing': timings.toString() },
      toastHeaders,
      confettiHeaders,
      csrfCookieHeader ? { 'Set-Cookie': csrfCookieHeader } : null,
    )
  });
};

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  const headers = {
    'Server-Timing': loaderHeaders.get('Server-Timing') ?? '',
  }
  return headers;
};

const ThemeFormSchema = z.object({
  theme: z.enum([ 'system', 'light', 'dark' ]),
});

export async function action({ request }: DataFunctionArgs) {
  const formData = await request.formData();
  const submission = parse(formData, {
    schema: ThemeFormSchema,
  });
  if (submission.intent !== 'submit') {
    return json({ status: 'idle', submission } as const);
  }
  if (!submission.value) {
    return json({ status: 'error', submission } as const, { status: 400 });
  }
  const { theme } = submission.value;

  const responseInit = {
    headers: { 'set-cookie': setTheme(theme) },
  };
  return json({ success: true, submission }, responseInit);
}

function Document({
  children,
  nonce,
  theme = 'light',
  env = {},
}: {
  children: React.ReactNode;
  nonce: string;
  theme?: Theme;
  env?: Record<string, string>;
}) {
  return (
    <html lang="en" className={`${theme} h-full overflow-x-hidden`}>
      <head>
        <ClientHintCheck nonce={nonce} />
        <Meta />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Links />
      </head>
      <body className="bg-background text-foreground">
        {children}
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(env)}`,
          }}
        />
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        <LiveReload nonce={nonce} />
      </body>
    </html>
  )
}

function App() {
  const data = useLoaderData<typeof loader>();
  const nonce = useNonce();
  // const user = useOptionalUser();
  const theme = useTheme();
  // const matches = useMatches();
  // const isOnSearchPage = matches.find(m => m.id === 'routes/users+/index');
  // const searchBar = isOnSearchPage ? null : <SearchBar status='idle' />;

  return (
    <Document nonce={nonce} theme={theme} env={data.ENV}>
      <Outlet />
    </Document>
  )
}

function AppWithProviders() {
  const data = useLoaderData<typeof loader>();
  return (
    <AuthenticityTokenProvider token={data.csrfToken}>
      <HoneypotProvider {...data.honeyProps}>
        <App />
      </HoneypotProvider>
    </AuthenticityTokenProvider>
  )
}

export default withSentry(AppWithProviders);

export function useTheme() {
  const hints = useHints();
  const requestInfo = useRequestInfo();
  const optimisticMode = useOptimisticMode();
  if (optimisticMode) {
    return optimisticMode === 'system' ? hints.theme : optimisticMode;
  }
  return requestInfo.userPrefs.theme ?? hints.theme;
}

export function useOptimisticMode() {
  const fetchers = useFetchers();
  const themeFetcher = fetchers.find(f => f.formAction === '/');

  if (themeFetcher && themeFetcher.formData) {
    const submission = parse(themeFetcher.formData, {
      schema: ThemeFormSchema,
    });
    return submission.value?.theme;
  }
}
