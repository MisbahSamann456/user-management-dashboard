import React, { useState } from "react";
import { useAuth, DEMO_USER } from "../context/AuthContext";

const LoginPage = ({ onGoToSignup }) => {
  const { login } = useAuth();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!email.trim() || !password)
      return setError("Please enter both email and password.");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    const result = login(email.trim(), password);
    setLoading(false);
    if (!result.success) setError(result.error);
  };

  const fillDemo = () => {
    setEmail(DEMO_USER.email);
    setPassword(DEMO_USER.password);
    setError("");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Brand */}
        <div className="auth-brand">
          <div className="auth-brand__icon">👥</div>
          <div>
            <div className="auth-brand__name">UserHub</div>
            <div className="auth-brand__tag">Admin Dashboard</div>
          </div>
        </div>

        <div className="auth-divider" />

        <div className="auth-card__body">
          <h2 className="auth-card__heading">Welcome back</h2>
          <p className="auth-card__sub">Sign in to manage your team</p>

          {/* Demo hint */}
          <button type="button" className="auth-demo-banner" onClick={fillDemo}>
            <span className="auth-demo-banner__left">
              <span className="auth-demo-banner__badge">DEMO</span>
              <span>
                <strong>{DEMO_USER.email}</strong>
                <span className="auth-demo-banner__sep">·</span>
                <strong>{DEMO_USER.password}</strong>
              </span>
            </span>
            <span className="auth-demo-banner__cta">Click to fill →</span>
          </button>

          {error && (
            <div className="auth-error" role="alert">
              ⚠️ {error}
            </div>
          )}

          {/* Fields */}
          <div className="auth-fields">
            <div className="auth-field">
              <label className="auth-field__label" htmlFor="login-email">
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                className="auth-field__input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>

            <div className="auth-field">
              <label className="auth-field__label" htmlFor="login-password">
                Password
              </label>
              <div className="auth-field__input-wrap">
                <input
                  id="login-password"
                  type={showPass ? "text" : "password"}
                  className="auth-field__input auth-field__input--icon-right"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
               <button
  type="button"
  className="auth-field__eye"
  onClick={() => setShowPass((p) => !p)}
  aria-label={showPass ? "Hide password" : "Show password"}
>
  {showPass ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
    </svg>
  )}
</button>
              </div>
            </div>
          </div>

          <button
            className="auth-submit-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <span className="auth-submit-btn__spinner" />
            ) : (
              "Sign In"
            )}
          </button>

          <p className="auth-card__switch">
            New to UserHub?{" "}
            <button type="button" className="auth-link" onClick={onGoToSignup}>
              Create an account
            </button>
          </p>
        </div>
      </div>

      {/* Right-side info panel (desktop only) */}
      <div className="auth-info-panel">
        <div className="auth-info-panel__content">
          <div className="auth-info-panel__logo">👥</div>
          <h2 className="auth-info-panel__title">UserHub</h2>
          <p className="auth-info-panel__desc">
            A full-featured admin dashboard for managing users, departments,
            and analytics — all in one place.
          </p>
          <ul className="auth-info-panel__features">
            <li>✅ Full CRUD user management</li>
            <li>✅ Department & analytics views</li>
            <li>✅ Real-time activity tracking</li>
            <li>✅ Role-based access control</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;