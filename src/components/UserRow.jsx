import React from "react";

// Avatar background/text color pairs — cycles through users visually
const AVATAR_COLORS = [
  { bg: "#ede9fe", color: "#4338ca" },
  { bg: "#dcfce7", color: "#166534" },
  { bg: "#fce7f3", color: "#9d174d" },
  { bg: "#dbeafe", color: "#1e40af" },
  { bg: "#fef3c7", color: "#92400e" },
  { bg: "#f3e8ff", color: "#6b21a8" },
];

/**
 * Returns initials from first and last name.
 * e.g. "Leanne Graham" → "LG"
 */
const getInitials = (firstName, lastName) =>
  `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();

/**
 * UserRow — renders one user as a <tr> with avatar, colored badge,
 * status dot, and hover-reveal action buttons.
 *
 * @param {Object}   user        - { id, firstName, lastName, email, department, active }
 * @param {number}   index       - row index used to pick avatar color
 * @param {Function} onEdit      - called with the full user object on Edit click
 * @param {Function} onDelete    - called with the user id on Delete click
 */
const UserRow = ({ user, index, onEdit, onDelete }) => {
  const avatarStyle = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const initials    = getInitials(user.firstName, user.lastName);

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
            {initials}
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
        <span className={`badge badge--${user.department}`}>
          {user.department}
        </span>
      </td>

      {/* Email — hidden on mobile via CSS */}
      <td className="user-row__cell user-row__cell--email">
        {user.email}
      </td>

      {/* Active / Inactive status */}
      <td className="user-row__cell user-row__cell--status">
        <div className="status-cell">
          <div
            className={`status-dot ${
              user.active ? "status-dot--active" : "status-dot--inactive"
            }`}
          />
          {user.active ? "Active" : "Inactive"}
        </div>
      </td>

      {/* Hover-reveal action buttons */}
      <td className="user-row__cell user-row__cell--actions">
        <div className="row-actions">
          <button
            className="row-action-btn"
            onClick={() => onEdit(user)}
            aria-label={`Edit ${user.firstName} ${user.lastName}`}
            title="Edit user"
          >
            ✏️
          </button>
          <button
            className="row-action-btn row-action-btn--delete"
            onClick={() => onDelete(user.id)}
            aria-label={`Delete ${user.firstName} ${user.lastName}`}
            title="Delete user"
          >
            🗑️
          </button>
        </div>
      </td>
    </tr>
  );
};

export default UserRow;