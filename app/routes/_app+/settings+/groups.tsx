import { type MetaFunction } from '@remix-run/react';
import { type SettingsHeaderHandle } from '../settings.tsx';

export const handle: SettingsHeaderHandle = {
  settingHeader: {
    title: 'Groups Settings',
    description: 'Manage your group settings.',
  },
};

export default function GroupsSettings() {
  return (
    <div>
      <p>
        lipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit,
        vulputate eu pharetra nec, mattis ac neque. Duis vulputate commodo
        lectus, ac blandit elit tincidunt id. Sed rhoncus, tortor sed eleifend
      </p>
    </div>
  );
}

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Groups Settings',
      description: 'Groups Settings',
    },
  ];
};
