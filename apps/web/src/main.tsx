import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { LocalizationProvider } from "./localization/LocalizationProvider";
import "./index.css";
import DialogProvider from "./components/dialogs/DialogProvider";

import "./styles/creatoros-ui-scale.css";
ReactDOM.createRoot(
  document.getElementById("root")!,
).render(
  <React.StrictMode>
    <DialogProvider>
      <LocalizationProvider><App /></LocalizationProvider>
    </DialogProvider>
  </React.StrictMode>,
);

