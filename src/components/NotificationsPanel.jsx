import React from "react";

/**
 * NotificationsPanel — displays a feed of recent CRUD activity.
 * Activity entries are pushed by App.jsx whenever a user is added,
 * edited, or deleted — so this reflects real actions, not fake data.
 *
 * @param {Array} activityLog - array of { id, message, timestamp, type }
 */
const NotificationsPanel = ({ activityLog }) => {
  return (
    <div className="notifications-view">
      <div className="analytics-card">
        <h3 className="analytics-card__title">Recent Activity</h3>

        {activityLog.length === 0 ? (
          <p className="dept-card__empty">
            No activity yet. Try adding, editing, or deleting a user — it'll show up here.
          </p>
        ) : (
          <ul className="activity-feed">
            {activityLog.map((entry) => (
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

export default NotificationsPanel;