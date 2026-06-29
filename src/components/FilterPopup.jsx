import React, { useState } from "react";
import { DEPARTMENTS } from "../utils/constants";

// Empty filter state used for both initialisation and the Reset action
const EMPTY_FILTERS = { firstName: "", lastName: "", email: "", department: "" };

/**
 * FilterPopup — a dropdown panel for narrowing results by multiple fields.
 * Changes are only applied when the user explicitly clicks "Apply Filters".
 *
 * @param {Object}   activeFilters  - currently applied filter values from parent
 * @param {Function} onApplyFilters - called with the new filter object on apply
 * @param {Function} onResetFilters - called when the user resets all filters
 */
const FilterPopup = ({ activeFilters, onApplyFilters, onResetFilters }) => {
  const [isOpen, setIsOpen]             = useState(false);
  const [localFilters, setLocalFilters] = useState(EMPTY_FILTERS);

  const hasActiveFilters = Object.values(activeFilters).some(Boolean);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleToggle = () => {
    // Sync local draft with currently applied filters each time panel opens
    if (!isOpen) setLocalFilters(activeFilters);
    setIsOpen((prev) => !prev);
  };

  const handleFieldChange = (field, value) => {
    setLocalFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    setIsOpen(false);
  };

  const handleReset = () => {
    setLocalFilters(EMPTY_FILTERS);
    onResetFilters();
    setIsOpen(false);
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="filter-popup">
      <button
        className={`btn btn--secondary ${hasActiveFilters ? "btn--active" : ""}`}
        onClick={handleToggle}
        aria-expanded={isOpen}
      >
        🔽 Filter {hasActiveFilters && "(active)"}
      </button>

      {isOpen && (
        <div className="filter-popup__panel" role="dialog" aria-label="Filter options">
          <h3 className="filter-popup__title">Filter Users</h3>

          <div className="filter-popup__fields">
            <label className="filter-popup__label">
              First Name
              <input
                className="filter-popup__input"
                type="text"
                value={localFilters.firstName}
                onChange={(e) => handleFieldChange("firstName", e.target.value)}
                placeholder="e.g. Leanne"
              />
            </label>

            <label className="filter-popup__label">
              Last Name
              <input
                className="filter-popup__input"
                type="text"
                value={localFilters.lastName}
                onChange={(e) => handleFieldChange("lastName", e.target.value)}
                placeholder="e.g. Graham"
              />
            </label>

            <label className="filter-popup__label">
              Email
              <input
                className="filter-popup__input"
                type="text"
                value={localFilters.email}
                onChange={(e) => handleFieldChange("email", e.target.value)}
                placeholder="e.g. user@example.com"
              />
            </label>

            <label className="filter-popup__label">
              Department
              <select
                className="filter-popup__input"
                value={localFilters.department}
                onChange={(e) => handleFieldChange("department", e.target.value)}
              >
                <option value="">All Departments</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="filter-popup__actions">
            <button className="btn btn--ghost" onClick={handleReset}>
              Reset
            </button>
            <button className="btn btn--primary" onClick={handleApply}>
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPopup;