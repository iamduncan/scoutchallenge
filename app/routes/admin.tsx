import { Outlet } from '@remix-run/react';
import AdminLayout from '~/layouts/AdminLayout';

const AdminHome = () => {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  )
}

export default AdminHome;