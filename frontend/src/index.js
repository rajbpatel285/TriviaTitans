import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import "primereact/resources/themes/lara-light-indigo/theme.css"; // theme

import "primereact/resources/primereact.min.css"; // core

import "primeicons/primeicons.css"; // icons

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <App />
  // <React.StrictMode>
  // </React.StrictMode>
);
