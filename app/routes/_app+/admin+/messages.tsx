import { Outlet } from '@remix-run/react';
import { AdminList } from '#app/components/ui/index.ts';

export default function MessagesPage() {
  return (
    <AdminList title="Message" route="messages" listItems={[]}>
      <AdminList.Content>
        <Outlet />
      </AdminList.Content>
    </AdminList>
  );
}
