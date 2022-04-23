import { Outlet } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import AdminLayout from "~/layouts/AdminLayout";
import { requireSectionAdmin } from "~/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  await requireSectionAdmin(request);
  return null;
};

const AdminHome = () => {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
};

export default AdminHome;
