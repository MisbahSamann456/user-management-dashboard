import React, { useState, useMemo, useRef } from "react";
import Header             from "./components/Header";
import SearchBar          from "./components/SearchBar";
import FilterPopup        from "./components/FilterPopup";
import StatsRow           from "./components/StatsRow";
import UserTable          from "./components/UserTable";
import Pagination         from "./components/Pagination";
import UserForm           from "./components/UserForm";
import ConfirmDelete      from "./components/ConfirmDelete";
import Departments        from "./components/Departments";
import Analytics          from "./components/Analytics";
import DashboardOverview  from "./components/DashboardOverview";
import NotificationsPanel from "./components/NotificationsPanel";
import SettingsPanel      from "./components/SettingsPanel";
import useUsers           from "./hooks/useUsers";
import { useAuth }        from "./context/AuthContext";

import {
  searchUsers,
  applyFilters,
  sortUsers,
  getPaginationIndices,
} from "./utils/helpers";
import { DEFAULT_PAGE_SIZE } from "./utils/constants";
import "./styles/App.css";
import "./styles/components.css";

const EMPTY_FILTERS = { firstName: "", lastName: "", email: "", department: "" };

const VIEW_META = {
  dashboard:     { title: "Dashboard",       crumb: "Dashboard" },
  users:         { title: "User Management", crumb: "Users" },
  departments:   { title: "Departments",     crumb: "Departments" },
  analytics:     { title: "Analytics",       crumb: "Analytics" },
  notifications: { title: "Notifications",   crumb: "Notifications" },
  settings:      { title: "Settings",        crumb: "Settings" },
};

let activityIdCounter = 0;

const App = () => {
  // ─── Auth ──────────────────────────────────────────────────────────────────
  const { currentUser, isAdmin } = useAuth();

  const initials = currentUser
    ? `${currentUser.firstName[0]}${currentUser.lastName[0]}`
    : "MS";

  // ─── Data & API state ──────────────────────────────────────────────────────
  const { users, isLoading, error, addUser, editUser, removeUser, clearError } = useUsers();

  // ─── Navigation state ───────────────────────────────────────────────────────
  const [activeView, setActiveView] = useState("dashboard");

  // ─── Search & filter state ─────────────────────────────────────────────────
  const [searchQuery,   setSearchQuery]   = useState("");
  const [activeFilters, setActiveFilters] = useState(EMPTY_FILTERS);
  const searchBarRef = useRef(null);

  // ─── Sort state ────────────────────────────────────────────────────────────
  const [sortField,     setSortField]     = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");

  // ─── Pagination state ──────────────────────────────────────────────────────
  const [pageSizePref, setPageSizePref] = useState(DEFAULT_PAGE_SIZE);
  const [currentPage,  setCurrentPage]  = useState(1);
  const [pageSize,     setPageSize]     = useState(DEFAULT_PAGE_SIZE);

  // ─── Settings state ─────────────────────────────────────────────────────────
  const [compactMode, setCompactMode] = useState(false);

  // ─── Modal state ───────────────────────────────────────────────────────────
  const [isFormOpen,   setIsFormOpen]   = useState(false);
  const [userToEdit,   setUserToEdit]   = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  // ─── Notifications + bell state ────────────────────────────────────────────
  const [activityLog, setActivityLog] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isBellOpen,  setIsBellOpen]  = useState(false);

  // ─── Activity log helper ────────────────────────────────────────────────────
  const logActivity = (type, message) => {
    activityIdCounter += 1;
    const entry = {
      id: activityIdCounter,
      type,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setActivityLog((prev) => [entry, ...prev].slice(0, 20));
    setUnreadCount((prev) => prev + 1);
  };

  // ─── Derived data pipeline ─────────────────────────────────────────────────
  const processedUsers = useMemo(() => {
    const searched = searchUsers(users, searchQuery);
    const filtered = applyFilters(searched, activeFilters);
    return sortUsers(filtered, sortField, sortDirection);
  }, [users, searchQuery, activeFilters, sortField, sortDirection]);

  const { startIndex, endIndex } = getPaginationIndices(currentPage, pageSize);
  const visibleUsers = processedUsers.slice(startIndex, endIndex);

  // ─── Navigation ─────────────────────────────────────────────────────────────
  const handleNavigate = (viewKey) => {
    setActiveView(viewKey);
    if (viewKey === "notifications") setUnreadCount(0);
  };

  // ─── Sort ──────────────────────────────────────────────────────────────────
  const handleSort = (columnKey) => {
    if (sortField === columnKey) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(columnKey);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  // ─── Filters ───────────────────────────────────────────────────────────────
  const handleApplyFilters  = (filters) => { setActiveFilters(filters); setCurrentPage(1); };
  const handleResetFilters  = ()         => { setActiveFilters(EMPTY_FILTERS); setCurrentPage(1); };

  // ─── Pagination ───────────────────────────────────────────────────────────
  const handlePageChange       = (newPage) => setCurrentPage(newPage);
  const handlePageSizeChange   = (newSize) => { setPageSize(newSize); setCurrentPage(1); };
  const handleDefaultPageSizeChange = (newSize) => {
    setPageSizePref(newSize);
    setPageSize(newSize);
    setCurrentPage(1);
  };

  // ─── Add / Edit ───────────────────────────────────────────────────────────
  const handleOpenAddForm  = () => { setUserToEdit(null); setIsFormOpen(true); };
  const handleOpenEditForm = (user) => { setUserToEdit(user); setIsFormOpen(true); };
  const handleCloseForm    = () => { setIsFormOpen(false); setUserToEdit(null); };

  const handleFormSubmit = async (formData) => {
    if (userToEdit) {
      await editUser(userToEdit.id, formData);
      logActivity("edit", `Updated ${formData.firstName} ${formData.lastName}'s profile`);
    } else {
      await addUser(formData);
      logActivity("add", `Added new user ${formData.firstName} ${formData.lastName}`);
    }
    handleCloseForm();
  };

  // ─── Delete ───────────────────────────────────────────────────────────────
  const handleRequestDelete = (userId) => setUserToDelete(users.find((u) => u.id === userId));
  const handleConfirmDelete = async () => {
    if (userToDelete) {
      await removeUser(userToDelete.id);
      logActivity("delete", `Removed ${userToDelete.firstName} ${userToDelete.lastName}`);
    }
    setUserToDelete(null);
  };
  const handleCancelDelete = () => setUserToDelete(null);

  // ─── Search icon ──────────────────────────────────────────────────────────
  const handleSearchIconClick = () => {
    setActiveView("users");
    setTimeout(() => searchBarRef.current?.focus(), 0);
  };

  const meta = VIEW_META[activeView] || VIEW_META.dashboard;

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="app">
      <Header
        activeView={activeView}
        onNavigate={handleNavigate}
        userCount={users.length}
        unreadCount={unreadCount}
      />

      <div className="app__main">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar__left">
            <h1 className="topbar__title">{meta.title}</h1>
            <div className="topbar__breadcrumb">
              <span>Home</span>
              <span>›</span>
              <span>{meta.crumb}</span>
            </div>
          </div>

          <div className="topbar__right">
            <button
              className="topbar__icon-btn"
              aria-label="Search"
              title="Search"
              onClick={handleSearchIconClick}
            >
              🔍
            </button>

            <div className="topbar__bell-wrapper">
              <button
                className="topbar__icon-btn"
                aria-label="Notifications"
                title="Notifications"
                onClick={() => setIsBellOpen((prev) => !prev)}
              >
                🔔
                {unreadCount > 0 && (
                  <span className="topbar__bell-badge">{unreadCount}</span>
                )}
              </button>

              {isBellOpen && (
                <div className="bell-dropdown">
                  <div className="bell-dropdown__header">Recent Activity</div>
                  {activityLog.length === 0 ? (
                    <p className="bell-dropdown__empty">No activity yet.</p>
                  ) : (
                    activityLog.slice(0, 5).map((entry) => (
                      <div key={entry.id} className="bell-dropdown__item">
                        <span>{entry.message}</span>
                        <span className="bell-dropdown__time">{entry.timestamp}</span>
                      </div>
                    ))
                  )}
                  <button
                    className="bell-dropdown__viewall"
                    onClick={() => { setIsBellOpen(false); handleNavigate("notifications"); }}
                  >
                    View all
                  </button>
                </div>
              )}
            </div>

            {/* Only Admins see the + Add User button */}
            {isAdmin && (
              <button
                className="btn btn--primary"
                onClick={handleOpenAddForm}
                aria-label="Add new user"
              >
                + Add User
              </button>
            )}

            <div
              className="topbar__avatar"
              aria-label="User menu"
              title={currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : ""}
              onClick={() => handleNavigate("settings")}
            >
              {initials}
            </div>
          </div>
        </header>

        <main className="page-content">
          {/* Error banner */}
          {error && (
            <div className="error-banner" role="alert">
              <span>⚠️ {error}</span>
              <button className="error-banner__dismiss" onClick={clearError} aria-label="Dismiss error">
                ✕
              </button>
            </div>
          )}

          {/* ── Dashboard ─────────────────────────────────────────────────── */}
          {activeView === "dashboard" && (
            <>
              <StatsRow users={users} filtered={processedUsers.length} />
              <DashboardOverview
                users={users}
                activityLog={activityLog}
                onViewAllActivity={() => handleNavigate("notifications")}
              />
            </>
          )}

          {/* ── Users ─────────────────────────────────────────────────────── */}
          {activeView === "users" && (
            <>
              <StatsRow users={users} filtered={processedUsers.length} />

              {/* Read-only notice for non-admin users */}
              {!isAdmin && (
                <div className="readonly-banner">
                  👁️ <strong>Read-only mode</strong> — You can view all data but cannot add,
                  edit, or delete users. Contact an Administrator to upgrade your access.
                </div>
              )}

              <div className="toolbar">
                <SearchBar
                  ref={searchBarRef}
                  searchQuery={searchQuery}
                  onSearchChange={(query) => { setSearchQuery(query); setCurrentPage(1); }}
                />
                <FilterPopup
                  activeFilters={activeFilters}
                  onApplyFilters={handleApplyFilters}
                  onResetFilters={handleResetFilters}
                />
              </div>

              <div className={`table-wrapper ${compactMode ? "table-wrapper--compact" : ""}`}>
                <UserTable
                  users={visibleUsers}
                  isLoading={isLoading}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  onEditUser={handleOpenEditForm}
                  onDeleteUser={handleRequestDelete}
                  isAdmin={isAdmin}
                />
                <Pagination
                  currentPage={currentPage}
                  pageSize={pageSize}
                  totalUsers={processedUsers.length}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                />
              </div>
            </>
          )}

          {/* ── Departments ───────────────────────────────────────────────── */}
          {activeView === "departments" && <Departments users={users} />}

          {/* ── Analytics ─────────────────────────────────────────────────── */}
          {activeView === "analytics" && <Analytics users={users} />}

          {/* ── Notifications ─────────────────────────────────────────────── */}
          {activeView === "notifications" && (
            <NotificationsPanel activityLog={activityLog} />
          )}

          {/* ── Settings ──────────────────────────────────────────────────── */}
          {activeView === "settings" && (
            <SettingsPanel
              defaultPageSize={pageSizePref}
              onDefaultPageSizeChange={handleDefaultPageSizeChange}
              compactMode={compactMode}
              onCompactModeChange={setCompactMode}
            />
          )}
        </main>
      </div>

      {/* Modals — only reachable by admins since the buttons are hidden for users */}
      {isFormOpen && isAdmin && (
        <UserForm
          userToEdit={userToEdit}
          onSubmit={handleFormSubmit}
          onClose={handleCloseForm}
        />
      )}

      {userToDelete && isAdmin && (
        <ConfirmDelete
          user={userToDelete}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default App;