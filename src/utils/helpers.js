import { DEFAULT_DEPARTMENT, DEPARTMENTS } from "./constants";

// Avatar color pairs cycled by user index in the table
export const AVATAR_COLORS = [
  { bg: "#ede9fe", color: "#4338ca" },
  { bg: "#dcfce7", color: "#166534" },
  { bg: "#fce7f3", color: "#9d174d" },
  { bg: "#dbeafe", color: "#1e40af" },
  { bg: "#fef3c7", color: "#92400e" },
  { bg: "#f3e8ff", color: "#6b21a8" },
];

/**
 * Maps a raw JSONPlaceholder user object into the shape our app uses.
 * Splits the full `name` field into firstName / lastName, cycles through
 * DEPARTMENTS by index (since the API has no department field), and
 * adds an `active` flag for the status column.
 *
 * @param {Object} apiUser - raw user object from JSONPlaceholder
 * @param {number} index   - position in the array, used to vary department/status
 * @returns {Object} - { id, firstName, lastName, email, department, active }
 */
export const mapApiUserToAppUser = (apiUser, index) => {
  const nameParts = apiUser.name.trim().split(" ");
  const firstName = nameParts[0] || "";
  const lastName  = nameParts.slice(1).join(" ") || "";

  return {
    id:         apiUser.id,
    firstName,
    lastName,
    email:      apiUser.email,
    // Cycle through the department list so the dashboard isn't all-IT
    department: DEPARTMENTS[index % DEPARTMENTS.length] || DEFAULT_DEPARTMENT,
    active:     index % 4 !== 3,
  };
};

/**
 * Sorts an array of users by a given field in ascending or descending order.
 * Uses localeCompare for consistent alphabetical ordering across browsers.
 *
 * @param {Array}  users     - array of app user objects
 * @param {string} field     - the field key to sort by
 * @param {string} direction - "asc" | "desc"
 * @returns {Array} new sorted array (does not mutate the original)
 */
export const sortUsers = (users, field, direction) => {
  return [...users].sort((a, b) => {
    const valueA = String(a[field]).toLowerCase();
    const valueB = String(b[field]).toLowerCase();
    const comparison = valueA.localeCompare(valueB);
    return direction === "asc" ? comparison : -comparison;
  });
};

/**
 * Filters users against a text query across first name, last name, and email.
 *
 * @param {Array}  users - array of app user objects
 * @param {string} query - raw search string from the search bar
 * @returns {Array} filtered subset of users
 */
export const searchUsers = (users, query) => {
  const normalised = query.trim().toLowerCase();
  if (!normalised) return users;

  return users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(normalised) ||
      user.lastName.toLowerCase().includes(normalised)  ||
      user.email.toLowerCase().includes(normalised)
  );
};

/**
 * Applies filter criteria from FilterPopup to the user list.
 * All non-empty criteria must match (AND logic).
 *
 * @param {Array}  users   - array of app user objects
 * @param {Object} filters - { firstName, lastName, email, department }
 * @returns {Array} filtered subset of users
 */
export const applyFilters = (users, filters) => {
  return users.filter((user) => {
    const matchFirst = !filters.firstName  || user.firstName.toLowerCase().includes(filters.firstName.toLowerCase());
    const matchLast  = !filters.lastName   || user.lastName.toLowerCase().includes(filters.lastName.toLowerCase());
    const matchEmail = !filters.email      || user.email.toLowerCase().includes(filters.email.toLowerCase());
    const matchDept  = !filters.department || user.department === filters.department;
    return matchFirst && matchLast && matchEmail && matchDept;
  });
};

/**
 * Calculates the slice indices for the current page.
 *
 * @param {number} currentPage - 1-based page number
 * @param {number} pageSize    - number of rows per page
 * @returns {{ startIndex: number, endIndex: number }}
 */
export const getPaginationIndices = (currentPage, pageSize) => {
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex   = startIndex + pageSize;
  return { startIndex, endIndex };
};

/**
 * Generates a unique numeric ID larger than any existing user ID.
 * Needed because JSONPlaceholder always returns id: 11 for POST requests.
 *
 * @param {Array} users - current list of app user objects
 * @returns {number}
 */
export const generateUniqueId = (users) => {
  const maxId = users.reduce((max, user) => Math.max(max, user.id), 0);
  return maxId + 1;
};