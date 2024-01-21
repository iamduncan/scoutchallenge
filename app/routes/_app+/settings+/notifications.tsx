import { type SettingsHeaderHandle } from '../settings.tsx';

export const handle: SettingsHeaderHandle = {
  settingHeader: {
    title: 'Notification Settings',
    description: 'Manage which notifications you receive',
  }
}

export default function SettingsNotificationsPage() {
  return (
    <>
      <h1 className="text-xl font-semibold">Notification Settings</h1>
      <p>This is the settings page.</p>
    </>
  );
}
