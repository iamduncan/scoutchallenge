import { Outlet } from '@remix-run/react';

export default function ChallengeSectionPage() {
  return (
    <div className="fixed inset-0 z-50 block h-full w-full overflow-y-auto bg-gray-600 bg-opacity-50">
      <div className="flex h-full w-full items-center justify-center">
        <div className="mx-auto w-10/12 rounded-md border bg-white shadow-lg">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
