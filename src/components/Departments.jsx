import React from "react";
import { DEPARTMENTS } from "../utils/constants";

// Same color system as badges, keyed by department name
const DEPT_COLORS = {
  IT:          { bg: "#ede9fe", color: "#4338ca" },
  Engineering: { bg: "#dcfce7", color: "#166534" },
  Sales:       { bg: "#fef3c7", color: "#92400e" },
  HR:          { bg: "#fce7f3", color: "#9d174d" },
  Finance:     { bg: "#dbeafe", color: "#1e40af" },
  Marketing:   { bg: "#f3e8ff", color: "#6b21a8" },
};

/**
 * Departments — groups all users by department and shows a card per
 * department with member count, active ratio, and the member list.
 *
 * @param {Array} users - full unfiltered user list
 */
const Departments = ({ users }) => {
  return (
    <div className="departments-view">
      <div className="departments-grid">
        {DEPARTMENTS.map((dept) => {
          const members      = users.filter((u) => u.department === dept);
          const activeCount  = members.filter((u) => u.active).length;
          const colors       = DEPT_COLORS[dept] || { bg: "#f1f5f9", color: "#475569" };

          return (
            <div key={dept} className="dept-card">
              <div className="dept-card__header">
                <div
                  className="dept-card__icon"
                  style={{ background: colors.bg, color: colors.color }}
                >
                  🏢
                </div>
                <div>
                  <div className="dept-card__name">{dept}</div>
                  <div className="dept-card__count">
                    {members.length} {members.length === 1 ? "member" : "members"}
                  </div>
                </div>
              </div>

              {members.length > 0 ? (
                <ul className="dept-card__members">
                  {members.map((member) => (
                    <li key={member.id} className="dept-card__member">
                      <span
                        className={`status-dot ${
                          member.active ? "status-dot--active" : "status-dot--inactive"
                        }`}
                      />
                      {member.firstName} {member.lastName}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="dept-card__empty">No members in this department yet.</p>
              )}

              {members.length > 0 && (
                <div className="dept-card__footer">
                  {activeCount}/{members.length} active
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Departments;