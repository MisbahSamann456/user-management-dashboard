import React from "react";

/**
 * StatsRow — four summary metric cards shown above the user table.
 * Gives admins an at-a-glance overview before drilling into the list.
 *
 * @param {Array}  users     - full unfiltered user list for accurate counts
 * @param {number} filtered  - count of users after search/filter applied
 */
const StatsRow = ({ users, filtered }) => {
  const totalUsers      = users.length;
  const activeUsers     = users.filter((u) => u.active).length;
  const departments     = [...new Set(users.map((u) => u.department))].length;
  const inactiveUsers   = totalUsers - activeUsers;

  return (
    <div className="stats-row">
      {/* Total users */}
      <div className="stat-card">
        <div className="stat-card__header">
          <span className="stat-card__label">Total users</span>
          <div className="stat-card__icon stat-card__icon--purple"
               aria-hidden="true">👥</div>
        </div>
        <div className="stat-card__value">{totalUsers}</div>
        <div className="stat-card__sub">
          {filtered < totalUsers
            ? `${filtered} match current filter`
            : "All users loaded"}
        </div>
      </div>

      {/* Active users */}
      <div className="stat-card">
        <div className="stat-card__header">
          <span className="stat-card__label">Active</span>
          <div className="stat-card__icon stat-card__icon--green"
               aria-hidden="true">✅</div>
        </div>
        <div className="stat-card__value">{activeUsers}</div>
        <div className="stat-card__sub stat-card__sub--up">
          {totalUsers > 0
            ? `${Math.round((activeUsers / totalUsers) * 100)}% of total`
            : "—"}
        </div>
      </div>

      {/* Departments */}
      <div className="stat-card">
        <div className="stat-card__header">
          <span className="stat-card__label">Departments</span>
          <div className="stat-card__icon stat-card__icon--blue"
               aria-hidden="true">🏢</div>
        </div>
        <div className="stat-card__value">{departments}</div>
        <div className="stat-card__sub">Across all teams</div>
      </div>

      {/* Inactive */}
      <div className="stat-card">
        <div className="stat-card__header">
          <span className="stat-card__label">Inactive</span>
          <div className="stat-card__icon stat-card__icon--amber"
               aria-hidden="true">⏸️</div>
        </div>
        <div className="stat-card__value">{inactiveUsers}</div>
        <div className={`stat-card__sub ${inactiveUsers > 0 ? "stat-card__sub--down" : ""}`}>
          {inactiveUsers > 0 ? "Needs attention" : "All users active"}
        </div>
      </div>
    </div>
  );
};

export default StatsRow;