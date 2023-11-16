import { Outlet } from '@remix-run/react';
import { type LoaderFunction } from '@remix-run/server-runtime';
// import AdminLayout from "#app/layouts/AdminLayout.tsx";
import { requireUserWithRole } from '#app/utils/permissions.ts';

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserWithRole(request, 'admin');
  return null;
};

const AdminHome = () => {
  return <Outlet />;
};

export default AdminHome;
