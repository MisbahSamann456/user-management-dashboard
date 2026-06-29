import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const SignupPage = ({ onGoToLogin }) => {
  const { signup } = useAuth();
  const [form,    setForm]    = useState({ firstName: "", lastName: "", email: "", password: "", confirm: "" });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const set = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim())  e.firstName = "Required";
    if (!form.lastName.trim())   e.lastName  = "Required";
    if (!form.email.trim())      e.email     = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.password)          e.password  = "Required";
    else if (form.password.length < 6) e.password = "Min 6 characters";
    if (form.confirm !== form.password) e.confirm = "Passwords don't match";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) return setErrors(e);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    const result = signup(form.firstName.trim(), form.lastName.trim(), form.email.trim(), form.password);
    setLoading(false);
    if (!result.success) setErrors({ email: result.error });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-brand">
          <div className="auth-brand__icon">👥</div>
          <div>
            <div className="auth-brand__name">UserHub</div>
            <div className="auth-brand__tag">Admin Dashboard</div>
          </div>
        </div>

        <div className="auth-divider" />

        <div className="auth-card__body">
          <h2 className="auth-card__heading">Create an account</h2>
          <p className="auth-card__sub">You'll get read-only access. Contact an admin to upgrade.</p>

          <div className="auth-fields">
            <div className="auth-fields__row">
              <Field label="First Name" id="su-fn" value={form.firstName} error={errors.firstName}
                placeholder="Jane" onChange={(v) => set("firstName", v)} />
              <Field label="Last Name" id="su-ln" value={form.lastName} error={errors.lastName}
                placeholder="Doe" onChange={(v) => set("lastName", v)} />
            </div>

            <Field label="Email" id="su-em" type="email" value={form.email} error={errors.email}
              placeholder="jane@example.com" onChange={(v) => set("email", v)} />

            <div className="auth-field">
              <label className="auth-field__label" htmlFor="su-pw">Password</label>
              <div className="auth-field__input-wrap">
                <input
                  id="su-pw"
                  type={showPass ? "text" : "password"}
                  className={`auth-field__input auth-field__input--icon-right ${errors.password ? "auth-field__input--error" : ""}`}
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                />
                <button type="button" className="auth-field__eye"
  onClick={() => setShowPass((p) => !p)}
  aria-label="Toggle password visibility">
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
              {errors.password && <p className="auth-field__error">{errors.password}</p>}
            </div>

            <Field label="Confirm Password" id="su-cf" type="password" value={form.confirm}
              error={errors.confirm} placeholder="Repeat password" onChange={(v) => set("confirm", v)} />
          </div>

          <button className="auth-submit-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? <span className="auth-submit-btn__spinner" /> : "Create Account"}
          </button>

          <p className="auth-card__switch">
            Already have an account?{" "}
            <button type="button" className="auth-link" onClick={onGoToLogin}>Sign in</button>
          </p>
        </div>
      </div>

      <div className="auth-info-panel">
        <div className="auth-info-panel__content">
          <div className="auth-info-panel__logo">🔐</div>
          <h2 className="auth-info-panel__title">Access Levels</h2>
          <p className="auth-info-panel__desc">UserHub uses role-based access control to protect sensitive operations.</p>
          <div className="auth-role-cards">
            <div className="auth-role-card auth-role-card--admin">
              <div className="auth-role-card__title">👑 Administrator</div>
              <div className="auth-role-card__desc">Full CRUD access — add, edit, delete users and manage all settings.</div>
            </div>
            <div className="auth-role-card auth-role-card--user">
              <div className="auth-role-card__title">👤 User</div>
              <div className="auth-role-card__desc">Read-only access — view dashboard, analytics, and department data.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, id, type = "text", value, error, placeholder, onChange }) => (
  <div className="auth-field">
    <label className="auth-field__label" htmlFor={id}>{label}</label>
    <input
      id={id} type={type}
      className={`auth-field__input ${error ? "auth-field__input--error" : ""}`}
      placeholder={placeholder} value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    {error && <p className="auth-field__error">{error}</p>}
  </div>
);

export default SignupPage;