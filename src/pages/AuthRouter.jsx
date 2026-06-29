import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import LoginPage  from "./LoginPage";
import SignupPage from "./SignupPage";

/**
 * AuthRouter — shown when no session exists.
 * Manages which auth screen is visible (login vs signup).
 */
const AuthRouter = () => {
  const [screen, setScreen] = useState("login");

  return screen === "login"
    ? <LoginPage  onGoToSignup={() => setScreen("signup")} />
    : <SignupPage onGoToLogin={()  => setScreen("login")}  />;
};

export default AuthRouter;