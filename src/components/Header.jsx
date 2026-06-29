import React from "react";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { key: "dashboard",   label: "Dashboard",   icon: "📊" },
  { key: "users",       label: "Users",       icon: "👤" },
  { key: "departments", label: "Departments", icon: "🏢" },
  { key: "analytics",   label: "Analytics",   icon: "📈" },
];

const SYSTEM_ITEMS = [
  { key: "notifications", label: "Notifications", icon: "🔔" },
  { key: "settings",      label: "Settings",      icon: "⚙️" },
];

const Header = ({ activeView, onNavigate, userCount, unreadCount }) => {
  const { currentUser, logout } = useAuth();

  const initials = currentUser
    ? `${currentUser.firstName[0]}${currentUser.lastName[0]}`
    : "MS";

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__logo">👥</div>
        <div>
          <div className="sidebar__title">UserHub</div>
          <div className="sidebar__subtitle">Admin panel</div>
        </div>
      </div>

      <nav className="sidebar__nav" aria-label="Main navigation">
        <div className="sidebar__section-label">Main</div>

        {NAV_ITEMS.map((item) => (
          <div
            key={item.key}
            className={`nav-item ${activeView === item.key ? "active" : ""}`}
            onClick={() => onNavigate(item.key)}
            role="button" tabIndex={0}
            aria-current={activeView === item.key ? "page" : undefined}
            onKeyDown={(e) => e.key === "Enter" && onNavigate(item.key)}
          >
            <span className="nav-item__icon">{item.icon}</span>
            <span>{item.label}</span>
            {item.key === "dashboard" && (
              <span className="nav-item__badge">{userCount}</span>
            )}
          </div>
        ))}

        <div className="sidebar__section-label">System</div>

        {SYSTEM_ITEMS.map((item) => (
          <div
            key={item.key}
            className={`nav-item ${activeView === item.key ? "active" : ""}`}
            onClick={() => onNavigate(item.key)}
            role="button" tabIndex={0}
            aria-current={activeView === item.key ? "page" : undefined}
            onKeyDown={(e) => e.key === "Enter" && onNavigate(item.key)}
          >
            <span className="nav-item__icon">{item.icon}</span>
            <span>{item.label}</span>
            {item.key === "notifications" && unreadCount > 0 && (
              <span className="nav-item__badge">{unreadCount}</span>
            )}
          </div>
        ))}
      </nav>

      <div className="sidebar__divider" />

      <div className="sidebar__footer">
        <div
          className={`sidebar__user ${activeView === "settings" ? "active" : ""}`}
          onClick={() => onNavigate("settings")}
          role="button" tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && onNavigate("settings")}
        >
          <div
            className="user-avatar"
            style={{ background: "#6366f1", color: "#fff" }}
            aria-hidden="true"
          >
            {initials}
          </div>
          <div className="sidebar__user-info">
            <div className="sidebar__user-name">
              {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Misbah Samann"}
            </div>
            <div className="sidebar__user-role">
              {currentUser?.role || "Administrator"}
            </div>
          </div>
        </div>

        <button
          className="sidebar__logout-btn"
          onClick={logout}
          title="Sign out"
          aria-label="Sign out"
        >
          ⏻
        </button>
      </div>
    </aside>
  );
};

export default Header;