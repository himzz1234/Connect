import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import { SocketContextProvider } from "./context/SocketContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AuthContextProvider>
      <SocketContextProvider>
        <GoogleOAuthProvider clientId="139040244411-o11687g5s7a80g2t52lputcbf8dmfav6.apps.googleusercontent.com">
          <App />
        </GoogleOAuthProvider>
      </SocketContextProvider>
    </AuthContextProvider>
  </BrowserRouter>
);
