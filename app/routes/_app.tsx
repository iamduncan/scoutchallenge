import { Outlet } from '@remix-run/react';
import {
  type LinksFunction,
  type LoaderFunction,
} from '@remix-run/server-runtime';
// import layoutStyles from "#app/styles/layout.css";
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx';
import { requireUserId } from '#app/utils/auth.server.ts';

export const links: LinksFunction = () => [
  // { rel: "stylesheet", href: layoutStyles },
];

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);
  return null;
};

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  return (
    <GeneralErrorBoundary
      statusHandlers={{
        403: () => (
          <div className="h-full bg-muted p-4 rounded-lg w-full">
            <div className="mb-6 block text-xl text-blue-500">403</div>
            <div className="mb-2">
              <h3>Forbidden</h3>
            </div>
          </div>
        ),
      }}
    />
  )
}
