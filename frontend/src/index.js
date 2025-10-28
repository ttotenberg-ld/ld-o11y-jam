import { asyncWithLDProvider } from "launchdarkly-react-client-sdk";
import Observability from "@launchdarkly/observability";
import SessionReplay from "@launchdarkly/session-replay";
import React from "react";
import ReactDOM from "react-dom/client";
import { faker } from "@faker-js/faker";
import "./index.css";
import App from "./App";

(async () => {
  const LDProvider = await asyncWithLDProvider({
    clientSideID: '609ead905193530d7c28647b',

    context: {
      kind: "user",
      key: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
    },
    options: {
      plugins: [
        new Observability({
          appVersion: "3.6.0",
        }),
        new SessionReplay({
          privacySetting: "none",
        }),
      ],
    },
  });

  const root = ReactDOM.createRoot(document.getElementById("root"));
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
