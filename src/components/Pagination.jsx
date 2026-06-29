import React from "react";
import { PAGE_SIZE_OPTIONS } from "../utils/constants";

/**
 * Pagination — displays page navigation controls and a page-size selector.
 *
 * @param {number}   currentPage       - currently active page (1-based)
 * @param {number}   pageSize          - number of rows currently shown per page
 * @param {number}   totalUsers        - total number of users after filtering
 * @param {Function} onPageChange      - called with the new page number
 * @param {Function} onPageSizeChange  - called with the new page size
 */
const Pagination = ({ currentPage, pageSize, totalUsers, onPageChange, onPageSizeChange }) => {
  const totalPages  = Math.ceil(totalUsers / pageSize);
  const isFirstPage = currentPage === 1;
  const isLastPage  = currentPage === totalPages || totalPages === 0;

  // Range of users shown on this page e.g. "Showing 1–5 of 10"
  const rangeStart = totalUsers === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd   = Math.min(currentPage * pageSize, totalUsers);

  const handlePageSizeChange = (e) => {
    onPageSizeChange(Number(e.target.value));
  };

  return (
    <div className="pagination">
      <div className="pagination__info">
        Showing <strong>{rangeStart}–{rangeEnd}</strong> of <strong>{totalUsers}</strong> users
      </div>

      <div className="pagination__controls">
        <button
          className="btn btn--secondary btn--sm"
          onClick={() => onPageChange(1)}
          disabled={isFirstPage}
          aria-label="First page"
        >
          «
        </button>
        <button
          className="btn btn--secondary btn--sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isFirstPage}
          aria-label="Previous page"
        >
          ‹
        </button>

        <span className="pagination__page-indicator">
          Page {currentPage} of {totalPages || 1}
        </span>

        <button
          className="btn btn--secondary btn--sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLastPage}
          aria-label="Next page"
        >
          ›
        </button>
        <button
          className="btn btn--secondary btn--sm"
          onClick={() => onPageChange(totalPages)}
          disabled={isLastPage}
          aria-label="Last page"
        >
          »
        </button>
      </div>

      <div className="pagination__size-selector">
        <label htmlFor="page-size-select">Rows per page:</label>
        <select
          id="page-size-select"
          value={pageSize}
          onChange={handlePageSizeChange}
          className="pagination__select"
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Pagination;