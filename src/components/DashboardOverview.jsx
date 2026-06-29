import React from "react";

/**
 * DashboardOverview — the action-focused landing view. Shows what needs
 * attention right now (inactive users), what's new (most recent user),
 * and a short recent-activity preview. No charts here — that's Analytics' job.
 *
 * @param {Array}    users       - full unfiltered user list
 * @param {Array}    activityLog - recent CRUD activity entries
 * @param {Function} onViewAllActivity - navigates to the full Notifications view
 */
const DashboardOverview = ({ users, activityLog, onViewAllActivity }) => {
  const inactiveUsers = users.filter((u) => !u.active);
  // Highest id = most recently added, since generateUniqueId always increments
  const mostRecentUser = users.length > 0
    ? users.reduce((latest, u) => (u.id > latest.id ? u : latest), users[0])
    : null;

  return (
    <div className="dashboard-overview">
      <div className="dashboard-overview__grid">
        {/* Needs Attention */}
        <div className="analytics-card">
          <h3 className="analytics-card__title">⏸️ Needs Attention</h3>

          {inactiveUsers.length === 0 ? (
            <p className="dept-card__empty">All users are active — nothing to follow up on.</p>
          ) : (
            <ul className="dept-card__members">
              {inactiveUsers.map((user) => (
                <li key={user.id} className="dept-card__member">
                  <span className="status-dot status-dot--inactive" />
                  {user.firstName} {user.lastName}
                  <span className="badge" style={{ marginLeft: "auto" }}>
                    {user.department}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Most Recently Added */}
        <div className="analytics-card">
          <h3 className="analytics-card__title">🆕 Most Recently Added</h3>

          {mostRecentUser ? (
            <div className="recent-user-card">
              <div
                className="user-avatar"
                style={{ background: "#ede9fe", color: "#4338ca", width: 44, height: 44, fontSize: 14 }}
              >
                {mostRecentUser.firstName[0]}
                {mostRecentUser.lastName[0]}
              </div>
              <div>
                <div className="user-row__name">
                  {mostRecentUser.firstName} {mostRecentUser.lastName}
                </div>
                <div className="user-row__sub">{mostRecentUser.email}</div>
                <span className={`badge badge--${mostRecentUser.department}`} style={{ marginTop: 6, display: "inline-block" }}>
                  {mostRecentUser.department}
                </span>
              </div>
            </div>
          ) : (
            <p className="dept-card__empty">No users loaded yet.</p>
          )}
        </div>
      </div>

      {/* Recent Activity preview */}
      <div className="analytics-card">
        <div className="dashboard-recent__header">
          <h3 className="analytics-card__title" style={{ margin: 0 }}>
            🕒 Recent Activity
          </h3>
          <button className="btn btn--ghost btn--sm" onClick={onViewAllActivity}>
            View all →
          </button>
        </div>

        {activityLog.length === 0 ? (
          <p className="dept-card__empty">
            No activity yet. Try adding, editing, or deleting a user from the Users page.
          </p>
        ) : (
          <ul className="activity-feed">
            {activityLog.slice(0, 5).map((entry) => (
              <li key={entry.id} className="activity-feed__item">
                <span className={`activity-feed__icon activity-feed__icon--${entry.type}`}>
                  {entry.type === "add" && "➕"}
                  {entry.type === "edit" && "✏️"}
                  {entry.type === "delete" && "🗑️"}
                </span>
                <div>
                  <div className="activity-feed__message">{entry.message}</div>
                  <div className="activity-feed__time">{entry.timestamp}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DashboardOverview;