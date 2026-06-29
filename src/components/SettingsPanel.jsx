import React from "react";
import { PAGE_SIZE_OPTIONS } from "../utils/constants";
import { useAuth } from "../context/AuthContext";

const SettingsPanel = ({
  defaultPageSize,
  onDefaultPageSizeChange,
  compactMode,
  onCompactModeChange,
}) => {
  const { currentUser, logout } = useAuth();

  const initials = currentUser
    ? `${currentUser.firstName[0]}${currentUser.lastName[0]}`
    : "MS";

  return (
    <div className="settings-view">
      <div className="analytics-card">
        <h3 className="analytics-card__title">Profile</h3>
        <div className="settings-row">
          <div
            className="user-avatar"
            style={{ background: "#6366f1", color: "#fff", width: 44, height: 44, fontSize: 14 }}
          >
            {initials}
          </div>
          <div>
            <div className="user-row__name">
              {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Misbah Samann"}
            </div>
            <div className="user-row__sub">
              {currentUser?.role || "Administrator"} · {currentUser?.email || "admin@userhub.app"}
            </div>
          </div>
        </div>
      </div>

      <div className="analytics-card">
        <h3 className="analytics-card__title">Dashboard Preferences</h3>

        <div className="settings-pref-row">
          <div>
            <div className="settings-pref-label">Default rows per page</div>
            <div className="settings-pref-sub">Used whenever you load the dashboard</div>
          </div>
          <select
            className="pagination__select"
            value={defaultPageSize}
            onChange={(e) => onDefaultPageSizeChange(Number(e.target.value))}
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        <div className="settings-pref-row">
          <div>
            <div className="settings-pref-label">Compact table rows</div>
            <div className="settings-pref-sub">Reduce row height to fit more users on screen</div>
          </div>
          <button
            type="button"
            className={`settings-toggle ${compactMode ? "settings-toggle--on" : ""}`}
            onClick={() => onCompactModeChange(!compactMode)}
            aria-pressed={compactMode}
            aria-label="Toggle compact table rows"
          >
            <span className="settings-toggle__knob" />
          </button>
        </div>
      </div>

      <div className="analytics-card">
        <h3 className="analytics-card__title">Account</h3>
        <div className="settings-pref-row">
          <div>
            <div className="settings-pref-label">Sign out</div>
            <div className="settings-pref-sub">You'll be returned to the login screen</div>
          </div>
          <button className="btn btn--danger" onClick={logout}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;