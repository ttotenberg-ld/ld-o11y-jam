import { asyncWithLDProvider } from 'launchdarkly-react-client-sdk';
import Observability from '@launchdarkly/observability';
import SessionReplay from '@launchdarkly/session-replay';
import { FlagOverridePlugin, EventInterceptionPlugin } from '@launchdarkly/toolbar';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { faker } from '@faker-js/faker';
import './index.css';
import App from './App';

// Create the plugin instances at module level so they can be shared
export const flagOverridePlugin = new FlagOverridePlugin({
  storageNamespace: 'ld-o11y-jam-overrides',
});

export const eventInterceptionPlugin = new EventInterceptionPlugin({
  eventCapacity: 250,
  enableLogging: true,
});

(async () => {
  const LDProvider = await asyncWithLDProvider({
    clientSideID: '609ead905193530d7c28647b', // Not a secret
    context: {
      "kind": "user",
      "key": faker.string.uuid(),
      "name": faker.person.fullName(),
      "email": faker.internet.email()
    },
    options: {
      // the observability plugins require React Web SDK v3.7+
      plugins: [
        new Observability(),
        new SessionReplay({
          privacySetting: 'none',
        }),
        flagOverridePlugin,
        eventInterceptionPlugin,
      ],
      // other options...
    }
  });

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <LDProvider>
    <div>
      <App />
      </div>
    </LDProvider>
  </React.StrictMode>
);
})();