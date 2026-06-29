import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AuthRouter from "./pages/AuthRouter";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./styles/App.css";
import "./styles/components.css";

const Root = () => {
  const { currentUser } = useAuth();
  return currentUser ? <App /> : <AuthRouter />;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <Root />
    </AuthProvider>
  </React.StrictMode>
);