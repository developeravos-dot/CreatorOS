import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {
  ThemeProvider,
} from "./design-system";

import "./design-system/tokens.css";
import "./design-system/components.css";
import "./design-system/layout.css";
import "./design-system/forms/forms.css";
import "./features/dashboard-enterprise-v2/dashboard-enterprise-v2.css";

import {
  DevelopmentDiagnostics,
} from "./core/observability";

import "./core/observability/observability.css";

import {
  AppErrorBoundary,
  NetworkStatusBanner,
} from "./core/resilience";

import "./core/resilience/resilience.css";

import { LocalizationProvider } from "./localization/LocalizationProvider";
import "./index.css";
import DialogProvider from "./components/dialogs/DialogProvider";

import "./styles/creatoros-ui-scale.css";
ReactDOM.createRoot(
  document.getElementById("root")!,
).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <ThemeProvider>
        <DialogProvider>
        <LocalizationProvider>
          <NetworkStatusBanner />
          <DevelopmentDiagnostics />
          <App />
        </LocalizationProvider>
        </DialogProvider>
      </ThemeProvider>
    </AppErrorBoundary>
  </React.StrictMode>,
);
