import { useForm } from '@conform-to/react';
import { parse } from '@conform-to/zod';
import { cssBundleHref } from '@remix-run/css-bundle';
import {
  type LinksFunction,
  type LoaderFunctionArgs,
  type MetaFunction,
  json,
  type HeadersFunction,
  type DataFunctionArgs,
} from '@remix-run/node';
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useFetcher,
  useFetchers,
  useLoaderData,
} from '@remix-run/react';
import { withSentry } from '@sentry/remix';
import { useEffect, useState } from 'react';
import { AuthenticityTokenProvider } from 'remix-utils/csrf/react';
import { HoneypotProvider } from 'remix-utils/honeypot/react';
import { z } from 'zod';
import CommandPalette from './components/command-palette.tsx';
import { Confetti } from './components/confetti.tsx';
import { GeneralErrorBoundary } from './components/error-boundary.tsx';
import { ErrorList } from './components/forms.tsx';
import GroupSectionSwitcher from './components/group-section-switcher.tsx';
import { MainNav } from './components/main-nav.tsx';
import { EpicProgress } from './components/progress-bar.tsx';
import { EpicToaster } from './components/toaster.tsx';
import { Button } from './components/ui/button.tsx';
import editorStylesheetUrl from './components/ui/Editor/styles.css';
import { Icon, href as iconsHref } from './components/ui/icon.tsx';
import UserMenu from './components/user-menu.tsx';
import tailwindStylesheetUrl from './styles/app.css';
import { getUserId } from './utils/auth.server.ts';
import { ClientHintCheck, getHints, useHints } from './utils/client-hints.tsx';
import { getConfetti } from './utils/confetti.server.ts';
import { csrf } from './utils/csrf.server.ts';
import { prisma } from './utils/db.server.ts';
import { getEnv } from './utils/env.server.ts';
import { honeypot } from './utils/honeypot.server.ts';
import { combineHeaders, getDomainUrl } from './utils/misc.tsx';
import { useNonce } from './utils/nonce-provider.ts';
import { useRequestInfo } from './utils/request-info.ts';
import { type Theme, getTheme, setTheme } from './utils/theme.server.ts';
import { makeTimings, time } from './utils/timing.server.ts';
import { getToast } from './utils/toast.server.ts';
import { useOptionalUser } from './utils/user.ts';

export const links: LinksFunction = () => {
  return [
    // Preload svg sprite as a resource to avoid render blocking
    { rel: 'preload', href: iconsHref, as: 'image' },
    // Preload CSS as a resource to avoid render blocking
    // { rel: 'preload', href: fontStyleSheetUrl, as: 'style' },
    { rel: 'preload', href: tailwindStylesheetUrl, as: 'style' },
    cssBundleHref ? { rel: 'preload', href: cssBundleHref, as: 'style' } : null,
    { rel: 'stylesheet', href: tailwindStylesheetUrl },
    { rel: 'stylesheet', href: editorStylesheetUrl },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com/',
      crossOrigin: 'anonymous',
    } as const,
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Nunito&display=swap',
    },
    {
      rel: 'manifest',
      href: '/app.webmanifest',
    },
  ].filter(Boolean);
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data ? 'Scout Challenge' : 'Error | Scout Challenge' },
    { name: 'description', content: 'Scout Challenge' },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const timings = makeTimings('root loader');
  const userId = await time(() => getUserId(request), {
    timings,
    type: 'getUserId',
    desc: 'getUserId in root',
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
      { timings, type: 'find user', desc: 'find user in root' },
    )
    : null;
  if (userId && !user) {
    console.info('something weird happened');
    // something weird happened... The user is authenticated but we can't find
    // them in the database. Maybe they were deleted? Let's log them out.
    // await authenticator.logout(request, { redirectTo: "/" });
  }
  const { toast, headers: toastHeaders } = await getToast(request);
  const { confettiId, headers: confettiHeaders } = await getConfetti(request);
  const honeyProps = honeypot.getInputProps();
  const [ csrfToken, csrfCookieHeader ] = await csrf.commitToken();

  return json(
    {
      user,
      requestInfo: {
        hints: getHints(request),
        origin: getDomainUrl(request),
        path: new URL(request.url).pathname,
        userPrefs: {
          theme: getTheme(request),
        },
      },
      ENV: getEnv(),
      toast,
      confettiId,
      honeyProps,
      csrfToken,
    },
    {
      headers: combineHeaders(
        { 'Server-Timing': timings.toString() },
        toastHeaders,
        confettiHeaders,
        csrfCookieHeader ? { 'Set-Cookie': csrfCookieHeader } : null,
      ),
    },
  );
};

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  const headers = {
    'Server-Timing': loaderHeaders.get('Server-Timing') ?? '',
  };
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
  );
}

function App() {
  const data = useLoaderData<typeof loader>();
  const nonce = useNonce();
  const user = useOptionalUser();
  const theme = useTheme();

  const [ commandPaletteOpen, setCommandPaletteOpen ] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setCommandPaletteOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, []);

  return (
    <Document nonce={nonce} theme={theme} env={data.ENV}>
      <div className="flex h-screen flex-col justify-between">
        <header>
          <nav>
            <div className="border-b">
              <div className="flex h-16 items-center px-4">
                <Link to="/" className="flex gap-1">
                  <div className="font-light">Scout</div>
                  <div className="font-bold">Challenge</div>
                </Link>
                {user && (<GroupSectionSwitcher className='mx-4' />)}
                <MainNav className="mx-6" />
                <div className="ml-auto flex items-center space-x-4">
                  <div className="ml-auto max-w-sm flex-1">
                    <div className="flex-1">
                      <button
                        onClick={() => setCommandPaletteOpen(true)}
                        type="button" className="flex items-center transition-all ease-in-out lg:w-64 text-left text-sm space-x-3 px-4 h-10 bg-white ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm rounded-lg text-slate-400 dark:bg-slate-800 dark:ring-0 dark:text-slate-300 dark:highlight-white/5 dark:hover:bg-slate-700"
                      >
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-none text-slate-300 dark:text-slate-400" aria-hidden="true">
                          <path d="m19 19-3.5-3.5"></path>
                          <circle cx="11" cy="11" r="6"></circle>
                        </svg>
                        <span className="flex-auto hidden lg:block">Quick search...</span>
                        <kbd className="font-sans font-semibold hidden lg:block dark:text-slate-500">
                          <abbr title="Control" className="no-underline text-slate-300 dark:text-slate-500">Ctrl </abbr> K
                        </kbd>
                      </button>
                    </div>
                  </div>
                  {user ? (
                    <UserMenu />
                  ) : (
                    <Button asChild variant="default" size="sm">
                      <Link to="/login">Log In</Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </nav>
        </header>

        <div className="flex-1">
          <Outlet />
        </div>

        <div className="container">
          <ThemeSwitch userPreference={data.requestInfo.userPrefs.theme} />
        </div>
      </div>

      <CommandPalette open={commandPaletteOpen} setOpen={setCommandPaletteOpen} />
      <Confetti id={data.confettiId} />
      <EpicToaster toast={data.toast} />
      <EpicProgress />
    </Document>
  );
}

function AppWithProviders() {
  const data = useLoaderData<typeof loader>();
  return (
    <AuthenticityTokenProvider token={data.csrfToken}>
      <HoneypotProvider {...data.honeyProps}>
        <App />
      </HoneypotProvider>
    </AuthenticityTokenProvider>
  );
}

export default withSentry(AppWithProviders);

export function useTheme() {
  const hints = useHints();
  const requestInfo = useRequestInfo();
  const optimisticMode = useOptimisticThemeMode();
  if (optimisticMode) {
    return optimisticMode === 'system' ? hints.theme : optimisticMode;
  }
  return requestInfo.userPrefs.theme ?? hints.theme;
}

export function useOptimisticThemeMode() {
  const fetchers = useFetchers();
  const themeFetcher = fetchers.find((f) => f.formAction === '/');

  if (themeFetcher && themeFetcher.formData) {
    const submission = parse(themeFetcher.formData, {
      schema: ThemeFormSchema,
    });
    return submission.value?.theme;
  }
}

function ThemeSwitch({ userPreference }: { userPreference?: Theme | null }) {
  const fetcher = useFetcher<typeof action>();

  const [ form ] = useForm({
    id: 'theme-switch',
    lastSubmission: fetcher.data?.submission,
  });

  const optimisticMode = useOptimisticThemeMode();
  const mode = optimisticMode ?? userPreference ?? 'system';
  const nextMode =
    mode === 'system' ? 'light' : mode === 'light' ? 'dark' : 'system';
  const modeLabel = {
    light: (
      <Icon name="sun">
        <span className="sr-only">Light</span>
      </Icon>
    ),
    dark: (
      <Icon name="moon">
        <span className="sr-only">Dark</span>
      </Icon>
    ),
    system: (
      <Icon name="laptop">
        <span className="sr-only">System</span>
      </Icon>
    ),
  };

  return (
    <fetcher.Form method="POST" {...form.props}>
      <input type="hidden" name="theme" value={nextMode} />
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex h-8 w-8 cursor-pointer items-center justify-center"
        >
          {modeLabel[ mode ]}
        </button>
      </div>
      <ErrorList errors={form.errors} id={form.errorId} />
    </fetcher.Form>
  );
}

export function ErrorBoundary() {
  // the nonce doesn't rely on the loader so we can access that
  const nonce = useNonce();

  // NOTE: you cannot use useLoaderData in an ErrorBoundary because the loader
  // likely failed to run so we have to do the best we can.
  // We could probably do better than this (it's possible the loader did run).
  // This would require a change in Remix.

  // Just make sure your root route never errors out and you'll always be able
  // to give the user a better UX.

  return (
    <Document nonce={nonce}>
      <GeneralErrorBoundary />
    </Document>
  );
}
