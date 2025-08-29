import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { MembersProvider } from "./context/MembersContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <MembersProvider>
        <App />
      </MembersProvider>
    </AuthProvider>
  </React.StrictMode>
);
