import { type SettingsHeaderHandle } from '../settings.tsx';

export const handle: SettingsHeaderHandle = {
  settingHeader: {
    title: 'Integration Settings',
    description: 'Manage how your integrations are configured'
  }
}

export default function SettingsIntegrationsPage() {
  return (
    <>
      <h1 className="text-xl font-semibold">Integrations</h1>
      <p>This is the settings page.</p>
    </>
  );
}
