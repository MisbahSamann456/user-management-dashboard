import React, { useState, useEffect } from "react";
import { DEPARTMENTS } from "../utils/constants";
import { validateUserForm, isFormValid } from "../utils/validators";

// Blank form state used when adding a new user — defaults to Active
const EMPTY_FORM = { firstName: "", lastName: "", email: "", department: "", active: true };

/**
 * UserForm — a modal form used for both Add and Edit operations.
 * Validates all fields on submit and shows inline error messages.
 *
 * @param {Object|null} userToEdit - populated when editing; null when adding
 * @param {Function}    onSubmit   - called with the cleaned form data on success
 * @param {Function}    onClose    - called when the modal should close
 */
const UserForm = ({ userToEdit, onSubmit, onClose }) => {
  const isEditMode = Boolean(userToEdit);

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors,   setErrors]   = useState({});

  // Pre-populate fields when opening in edit mode
  useEffect(() => {
    if (isEditMode) {
      setFormData({
        firstName:  userToEdit.firstName,
        lastName:   userToEdit.lastName,
        email:      userToEdit.email,
        department: userToEdit.department,
        active:     userToEdit.active,
      });
    } else {
      setFormData(EMPTY_FORM);
    }
    setErrors({});
  }, [userToEdit, isEditMode]);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear the error for this field as soon as the user starts correcting it
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = () => {
    const validationErrors = validateUserForm(formData);

    if (!isFormValid(validationErrors)) {
      setErrors(validationErrors);
      return; // Block submission until all errors are resolved
    }

    onSubmit(formData);
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-form-title"
    >
      <div className="modal modal--form" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2 id="user-form-title" className="modal__title">
            {isEditMode ? "Edit User" : "Add New User"}
          </h2>
          <button className="modal__close" onClick={onClose} aria-label="Close form">
            ✕
          </button>
        </div>

        <div className="modal__body">
          <FormField
            label="First Name"
            id="firstName"
            value={formData.firstName}
            error={errors.firstName}
            placeholder="e.g. Jane"
            onChange={(val) => handleFieldChange("firstName", val)}
          />
          <FormField
            label="Last Name"
            id="lastName"
            value={formData.lastName}
            error={errors.lastName}
            placeholder="e.g. Doe"
            onChange={(val) => handleFieldChange("lastName", val)}
          />
          <FormField
            label="Email"
            id="email"
            type="email"
            value={formData.email}
            error={errors.email}
            placeholder="e.g. jane.doe@company.com"
            onChange={(val) => handleFieldChange("email", val)}
          />

          {/* Department uses a select to prevent typos */}
          <div className="form-field">
            <label className="form-field__label" htmlFor="department">
              Department <span className="form-field__required">*</span>
            </label>
            <select
              id="department"
              className={`form-field__input ${errors.department ? "form-field__input--error" : ""}`}
              value={formData.department}
              onChange={(e) => handleFieldChange("department", e.target.value)}
            >
              <option value="">Select a department…</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            {errors.department && (
              <p className="form-field__error" role="alert">{errors.department}</p>
            )}
          </div>

          {/* Status toggle — Active / Inactive */}
          <div className="form-field">
            <label className="form-field__label" htmlFor="active">
              Status
            </label>
            <div className="status-toggle" role="group" aria-labelledby="active">
              <button
                type="button"
                className={`status-toggle__option ${
                  formData.active ? "status-toggle__option--active-selected" : ""
                }`}
                onClick={() => handleFieldChange("active", true)}
                aria-pressed={formData.active === true}
              >
                <span className="status-dot status-dot--active" aria-hidden="true" />
                Active
              </button>
              <button
                type="button"
                className={`status-toggle__option ${
                  !formData.active ? "status-toggle__option--inactive-selected" : ""
                }`}
                onClick={() => handleFieldChange("active", false)}
                aria-pressed={formData.active === false}
              >
                <span className="status-dot status-dot--inactive" aria-hidden="true" />
                Inactive
              </button>
            </div>
          </div>
        </div>

        <div className="modal__actions">
          <button className="btn btn--ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn--primary" onClick={handleSubmit}>
            {isEditMode ? "Save Changes" : "Create User"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── FormField Sub-component ──────────────────────────────────────────────────
// Reusable field layout — keeps the form DRY for text/email inputs

const FormField = ({ label, id, type = "text", value, error, placeholder, onChange }) => (
  <div className="form-field">
    <label className="form-field__label" htmlFor={id}>
      {label} <span className="form-field__required">*</span>
    </label>
    <input
      id={id}
      type={type}
      className={`form-field__input ${error ? "form-field__input--error" : ""}`}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      aria-invalid={Boolean(error)}
    />
    {error && (
      <p className="form-field__error" role="alert">{error}</p>
    )}
  </div>
);

export default UserForm;