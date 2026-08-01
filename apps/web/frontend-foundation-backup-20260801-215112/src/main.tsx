import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import DialogProvider from "./components/dialogs/DialogProvider";

ReactDOM.createRoot(
  document.getElementById("root")!,
).render(
  <React.StrictMode>
    <DialogProvider>
      <App />
    </DialogProvider>
  </React.StrictMode>,
);