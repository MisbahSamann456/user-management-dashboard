import React from "react";

/**
 * ConfirmDelete — a modal dialog that requires explicit confirmation before
 * the delete action is carried out. Prevents accidental data loss.
 *
 * @param {Object}   user      - the user about to be deleted (for display)
 * @param {Function} onConfirm - called when the user clicks "Yes, Delete"
 * @param {Function} onCancel  - called when the user clicks "Cancel" or the overlay
 */
const ConfirmDelete = ({ user, onConfirm, onCancel }) => {
  if (!user) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-title"
    >
      {/* Stop clicks inside the dialog from closing it */}
      <div className="modal modal--danger" onClick={(e) => e.stopPropagation()}>
        <div className="modal__icon">⚠️</div>

        <h2 id="confirm-delete-title" className="modal__title">
          Delete User
        </h2>

        <p className="modal__message">
          Are you sure you want to delete{" "}
          <strong>{user.firstName} {user.lastName}</strong>?
          This action cannot be undone.
        </p>

        <div className="modal__actions">
          <button className="btn btn--ghost" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn--danger" onClick={onConfirm}>
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDelete;