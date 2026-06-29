import React from "react";
import { TABLE_COLUMNS } from "../utils/constants";

/**
 * UserTable — sortable data grid. Passes isAdmin down to UserRow so
 * edit/delete buttons are hidden entirely for read-only users.
 */
const UserTable = ({
  users,
  isLoading,
  sortField,
  sortDirection,
  onSort,
  onEditUser,
  onDeleteUser,
  isAdmin = false,
}) => {
  const getSortIndicator = (columnKey) => {
    if (sortField !== columnKey) return "↕";
    return sortDirection === "asc" ? "↑" : "↓";
  };

  // Columns: hide the Actions column entirely for non-admins
  const visibleColumns = isAdmin
    ? TABLE_COLUMNS
    : TABLE_COLUMNS.filter((col) => col.key !== "actions");

  return (
    <table className="user-table" aria-label="User list">
      <thead className="user-table__head">
        <tr>
          {visibleColumns.map((col) => (
            <th
              key={col.key}
              className={[
                "user-table__th",
                col.sortable ? "user-table__th--sortable" : "",
                col.sortable && sortField === col.key ? "user-table__th--sorted" : "",
              ].join(" ")}
              onClick={col.sortable ? () => onSort(col.key) : undefined}
              aria-sort={
                sortField === col.key
                  ? sortDirection === "asc" ? "ascending" : "descending"
                  : undefined
              }
            >
              {col.label}
              {col.sortable && (
                <span className="user-table__sort-icon" aria-hidden="true">
                  {getSortIndicator(col.key)}
                </span>
              )}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {isLoading && (
          <tr>
            <td colSpan={visibleColumns.length} className="user-table__status">
              ⏳ Loading users…
            </td>
          </tr>
        )}

        {!isLoading && users.length === 0 && (
          <tr>
            <td colSpan={visibleColumns.length} className="user-table__status">
              😔 No users match your current search or filters.
            </td>
          </tr>
        )}

        {!isLoading &&
          users.map((user, index) => (
            <UserRow
              key={user.id}
              user={user}
              index={index}
              onEditUser={onEditUser}
              onDeleteUser={onDeleteUser}
              isAdmin={isAdmin}
            />
          ))}
      </tbody>
    </table>
  );
};

// ─── UserRow ──────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  { bg: "#ede9fe", color: "#4338ca" },
  { bg: "#dcfce7", color: "#166534" },
  { bg: "#fef3c7", color: "#92400e" },
  { bg: "#fce7f3", color: "#9d174d" },
  { bg: "#dbeafe", color: "#1e40af" },
  { bg: "#f3e8ff", color: "#6b21a8" },
];

const BADGE_STYLES = {
  IT:          { background: "#ede9fe", color: "#4338ca" },
  Engineering: { background: "#dcfce7", color: "#166534" },
  Sales:       { background: "#fef3c7", color: "#92400e" },
  HR:          { background: "#fce7f3", color: "#9d174d" },
  Finance:     { background: "#dbeafe", color: "#1e40af" },
  Marketing:   { background: "#f3e8ff", color: "#6b21a8" },
};

const UserRow = ({ user, index, onEditUser, onDeleteUser, isAdmin }) => {
  const avatarStyle = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const badgeStyle  = BADGE_STYLES[user.department] || { background: "#f1f5f9", color: "#475569" };

  return (
    <tr className="user-row">
      {/* ID */}
      <td className="user-row__cell user-row__cell--id">
        {user.id}
      </td>

      {/* Name + avatar */}
      <td className="user-row__cell user-row__cell--name">
        <div className="user-row__name-cell">
          <div
            className="user-avatar"
            style={{ background: avatarStyle.bg, color: avatarStyle.color }}
            aria-hidden="true"
          >
            {user.firstName[0]}{user.lastName[0]}
          </div>
          <div>
            <div className="user-row__name">
              {user.firstName} {user.lastName}
            </div>
            <div className="user-row__sub">{user.email}</div>
          </div>
        </div>
      </td>

      {/* Department badge */}
      <td className="user-row__cell">
        <span
          className="badge"
          style={{
            background:   badgeStyle.background,
            color:        badgeStyle.color,
            padding:      "3px 10px",
            borderRadius: "9999px",
            fontSize:     "12px",
            fontWeight:   "500",
          }}
        >
          {user.department}
        </span>
      </td>

      {/* Email */}
      <td className="user-row__cell user-row__cell--email">
        {user.email}
      </td>

      {/* Status */}
      <td className="user-row__cell user-row__cell--status">
        <div className="status-cell">
          <span
            className={`status-dot ${
              user.active ? "status-dot--active" : "status-dot--inactive"
            }`}
          />
          {user.active ? "Active" : "Inactive"}
        </div>
      </td>

      {/* Actions — only rendered for admins */}
      {isAdmin && (
        <td className="user-row__cell user-row__cell--actions">
          <div className="row-actions">
            <button
              className="row-action-btn"
              onClick={() => onEditUser(user)}
              aria-label={`Edit ${user.firstName} ${user.lastName}`}
              title="Edit user"
            >
              ✏️
            </button>
            <button
              className="row-action-btn row-action-btn--delete"
              onClick={() => onDeleteUser(user.id)}
              aria-label={`Delete ${user.firstName} ${user.lastName}`}
              title="Delete user"
            >
              🗑️
            </button>
          </div>
        </td>
      )}
    </tr>
  );
};

export default UserTable;