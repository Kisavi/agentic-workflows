import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// This is the actual "start" of a React app: find the DOM node from
// index.html (id="root") and tell React to render <App /> into it.
// createRoot is the modern (React 18) API - it enables concurrent
// features under the hood, but for a static dashboard like this you
// won't notice a difference from the older ReactDOM.render().
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
