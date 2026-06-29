import React from "react";
import { DEPARTMENTS } from "../utils/constants";

const DEPT_COLORS = {
  IT:          "#7c3aed",
  Engineering: "#16a34a",
  Sales:       "#d97706",
  HR:          "#db2777",
  Finance:     "#2563eb",
  Marketing:   "#9333ea",
};

/**
 * Analytics — the deep-dive data view: department distribution bar chart,
 * active/inactive ratio, a department size leaderboard, and a status
 * cross-tab showing active/inactive split per department.
 *
 * @param {Array} users - full unfiltered user list
 */
const Analytics = ({ users }) => {
  const totalUsers = users.length;
  const activeCount = users.filter((u) => u.active).length;
  const inactiveCount = totalUsers - activeCount;

  const departmentStats = DEPARTMENTS.map((dept) => {
    const members = users.filter((u) => u.department === dept);
    return {
      name:     dept,
      count:    members.length,
      active:   members.filter((u) => u.active).length,
      inactive: members.filter((u) => !u.active).length,
    };
  });

  const maxCount = Math.max(...departmentStats.map((d) => d.count), 1);

  // Leaderboard — departments ranked largest to smallest, ties broken by name
  const leaderboard = [...departmentStats]
    .filter((d) => d.count > 0)
    .sort((a, b) => b.count - a.count);

  return (
    <div className="analytics-view">
      {/* Department distribution bar chart */}
      <div className="analytics-card">
        <h3 className="analytics-card__title">Users by Department</h3>
        <div className="bar-chart">
          {departmentStats.map((dept) => (
            <div key={dept.name} className="bar-chart__row">
              <span className="bar-chart__label">{dept.name}</span>
              <div className="bar-chart__track">
                <div
                  className="bar-chart__fill"
                  style={{
                    width: `${(dept.count / maxCount) * 100}%`,
                    background: DEPT_COLORS[dept.name] || "#94a3b8",
                  }}
                />
              </div>
              <span className="bar-chart__value">{dept.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Active vs inactive ratio */}
      <div className="analytics-card">
        <h3 className="analytics-card__title">Active vs Inactive</h3>
        <div className="ratio-bar">
          <div
            className="ratio-bar__segment ratio-bar__segment--active"
            style={{ width: totalUsers ? `${(activeCount / totalUsers) * 100}%` : "0%" }}
          >
            {activeCount > 0 && `${activeCount}`}
          </div>
          <div
            className="ratio-bar__segment ratio-bar__segment--inactive"
            style={{ width: totalUsers ? `${(inactiveCount / totalUsers) * 100}%` : "0%" }}
          >
            {inactiveCount > 0 && `${inactiveCount}`}
          </div>
        </div>
        <div className="ratio-bar__legend">
          <span><span className="status-dot status-dot--active" /> Active ({activeCount})</span>
          <span><span className="status-dot status-dot--inactive" /> Inactive ({inactiveCount})</span>
        </div>
      </div>

      {/* Department leaderboard */}
      <div className="analytics-card">
        <h3 className="analytics-card__title">🏆 Department Leaderboard</h3>
        {leaderboard.length === 0 ? (
          <p className="dept-card__empty">No department data available.</p>
        ) : (
          <ol className="leaderboard">
            {leaderboard.map((dept, index) => (
              <li key={dept.name} className="leaderboard__row">
                <span className="leaderboard__rank">#{index + 1}</span>
                <span
                  className="leaderboard__dot"
                  style={{ background: DEPT_COLORS[dept.name] || "#94a3b8" }}
                />
                <span className="leaderboard__name">{dept.name}</span>
                <span className="leaderboard__count">
                  {dept.count} {dept.count === 1 ? "member" : "members"}
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* Status cross-tab — active/inactive per department */}
      <div className="analytics-card">
        <h3 className="analytics-card__title">Status by Department</h3>
        <table className="crosstab-table">
          <thead>
            <tr>
              <th>Department</th>
              <th>Active</th>
              <th>Inactive</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {departmentStats.map((dept) => (
              <tr key={dept.name}>
                <td>
                  <span
                    className="leaderboard__dot"
                    style={{ background: DEPT_COLORS[dept.name] || "#94a3b8", marginRight: 8 }}
                  />
                  {dept.name}
                </td>
                <td className="crosstab-table__active">{dept.active}</td>
                <td className="crosstab-table__inactive">{dept.inactive}</td>
                <td className="crosstab-table__total">{dept.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Analytics;