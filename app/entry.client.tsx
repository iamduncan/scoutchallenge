import { RemixBrowser } from '@remix-run/react';
import { startTransition } from 'react';
import { hydrateRoot } from 'react-dom/client';

if (ENV.MODE === 'production' && ENV.SENTRY_DSN) {
  import('./utils/monitoring.client.tsx').then(({ init }) => init());
}

startTransition(() => {
  hydrateRoot(document, <RemixBrowser />);
});

// if the browser supports SW (all modern browsers do it)
if ('serviceWorker' in navigator && ENV.MODE === 'production') {
  window.addEventListener('load', () => {
    // we will register it after the page complete the load
    navigator.serviceWorker
      .register('/sw.js')
      .then(function (registration) {
        console.log(
          'Service worker registered with scope:',
          registration.scope,
        );
      })
      .catch(function (error) {
        console.log('Service worker registration failed:', error);
      });
  });
}
