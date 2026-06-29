import React, { forwardRef } from "react";

/**
 * SearchBar — a controlled input that triggers real-time user filtering.
 * Wrapped in forwardRef so the topbar's search icon can programmatically
 * focus this input when clicked from a different view.
 *
 * @param {string}   searchQuery    - current query string from parent state
 * @param {Function} onSearchChange - called with the new query on every keystroke
 */
const SearchBar = forwardRef(({ searchQuery, onSearchChange }, ref) => {
  const handleChange = (e) => {
    onSearchChange(e.target.value);
  };

  const handleClear = () => {
    onSearchChange("");
  };

  return (
    <div className="search-bar">
      <span className="search-bar__icon" aria-hidden="true">🔍</span>

      <input
        ref={ref}
        className="search-bar__input"
        type="text"
        placeholder="Search by name or email…"
        value={searchQuery}
        onChange={handleChange}
        aria-label="Search users by name or email"
      />

      {searchQuery && (
        <button
          className="search-bar__clear"
          onClick={handleClear}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
});

SearchBar.displayName = "SearchBar";

export default SearchBar;