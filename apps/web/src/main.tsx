import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
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
      <DialogProvider>
        <LocalizationProvider>
          <NetworkStatusBanner />
          <DevelopmentDiagnostics />
          <App />
        </LocalizationProvider>
      </DialogProvider>
    </AppErrorBoundary>
  </React.StrictMode>,
);
