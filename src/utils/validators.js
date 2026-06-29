// Regex for validating standard email format (user@domain.tld)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates the user form fields and returns an error map.
 * Returns an empty object when all fields are valid.
 *
 * @param {Object} formData - { firstName, lastName, email, department }
 * @returns {Object} errors - keyed by field name, value is the error message
 */
export const validateUserForm = (formData) => {
  const errors = {};

  if (!formData.firstName?.trim()) {
    errors.firstName = "First name is required.";
  }

  if (!formData.lastName?.trim()) {
    errors.lastName = "Last name is required.";
  }

  if (!formData.email?.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_REGEX.test(formData.email.trim())) {
    errors.email = "Please enter a valid email address (e.g. user@example.com).";
  }

  if (!formData.department?.trim()) {
    errors.department = "Department is required.";
  }

  return errors;
};

/**
 * Returns true when the errors object contains no keys (form is valid).
 *
 * @param {Object} errors - result of validateUserForm()
 * @returns {boolean}
 */
export const isFormValid = (errors) => Object.keys(errors).length === 0;