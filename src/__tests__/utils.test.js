/**
 * Unit tests for validators.js and helpers.js
 * Run with: npm test
 */

import { describe, it, expect } from "vitest";
import { validateUserForm, isFormValid } from "../utils/validators";
import {
  mapApiUserToAppUser,
  sortUsers,
  searchUsers,
  applyFilters,
  getPaginationIndices,
  generateUniqueId,
} from "../utils/helpers";
import { DEPARTMENTS } from "../utils/constants";

// ─── Shared Fixtures ──────────────────────────────────────────────────────────

const VALID_FORM = {
  firstName:  "Jane",
  lastName:   "Doe",
  email:      "jane.doe@example.com",
  department: "Engineering",
  active:     true,
};

// SAMPLE_USERS now includes `active` since every user object in the app
// carries this field (added for the status toggle / Dashboard / Analytics views)
const SAMPLE_USERS = [
  { id: 1, firstName: "Alice",   lastName: "Brown", email: "alice@a.com",   department: "IT",          active: true  },
  { id: 2, firstName: "Bob",     lastName: "Clark", email: "bob@b.com",     department: "Engineering", active: true  },
  { id: 3, firstName: "Charlie", lastName: "Adams", email: "charlie@c.com", department: "Sales",       active: false },
];

// ─── validateUserForm ─────────────────────────────────────────────────────────

describe("validateUserForm", () => {
  it("returns no errors for a fully valid form", () => {
    expect(validateUserForm(VALID_FORM)).toEqual({});
  });

  it("returns error when firstName is missing", () => {
    expect(validateUserForm({ ...VALID_FORM, firstName: "" }).firstName).toBeDefined();
  });

  it("returns error when lastName is missing", () => {
    expect(validateUserForm({ ...VALID_FORM, lastName: "  " }).lastName).toBeDefined();
  });

  it("returns error when email is empty", () => {
    expect(validateUserForm({ ...VALID_FORM, email: "" }).email).toBeDefined();
  });

  it("returns error for email missing @", () => {
    expect(validateUserForm({ ...VALID_FORM, email: "notanemail" }).email).toBeDefined();
  });

  it("returns error for email missing domain", () => {
    expect(validateUserForm({ ...VALID_FORM, email: "user@" }).email).toBeDefined();
  });

  it("accepts valid email with subdomains", () => {
    expect(validateUserForm({ ...VALID_FORM, email: "user@mail.example.com" }).email).toBeUndefined();
  });

  it("returns error when department is missing", () => {
    expect(validateUserForm({ ...VALID_FORM, department: "" }).department).toBeDefined();
  });

  it("returns all 4 errors when form is completely empty", () => {
    const errors = validateUserForm({ firstName: "", lastName: "", email: "", department: "" });
    expect(Object.keys(errors).length).toBe(4);
  });

  it("does not require active to be set (status defaults via form state, not validation)", () => {
    const { active, ...formWithoutActive } = VALID_FORM;
    expect(validateUserForm(formWithoutActive)).toEqual({});
  });
});

// ─── isFormValid ──────────────────────────────────────────────────────────────

describe("isFormValid", () => {
  it("returns true when errors object is empty", () => {
    expect(isFormValid({})).toBe(true);
  });

  it("returns false when errors object has entries", () => {
    expect(isFormValid({ firstName: "required" })).toBe(false);
  });
});

// ─── mapApiUserToAppUser ──────────────────────────────────────────────────────
// Note: mapApiUserToAppUser now takes (apiUser, index). The index drives both
// the cycled department assignment and the alternating active/inactive status,
// since JSONPlaceholder provides neither field.

describe("mapApiUserToAppUser", () => {
  const raw = { id: 1, name: "Leanne Graham", email: "sincere@april.biz" };

  it("extracts firstName from first word of name", () => {
    expect(mapApiUserToAppUser(raw, 0).firstName).toBe("Leanne");
  });

  it("extracts lastName from remaining words", () => {
    expect(mapApiUserToAppUser(raw, 0).lastName).toBe("Graham");
  });

  it("preserves id and email", () => {
    const mapped = mapApiUserToAppUser(raw, 0);
    expect(mapped.id).toBe(1);
    expect(mapped.email).toBe("sincere@april.biz");
  });

  it("handles single-word name with empty lastName", () => {
    const mapped = mapApiUserToAppUser({ id: 2, name: "Cher", email: "cher@music.com" }, 0);
    expect(mapped.firstName).toBe("Cher");
    expect(mapped.lastName).toBe("");
  });

  it("handles three-word name by joining extra parts into lastName", () => {
    const mapped = mapApiUserToAppUser({ id: 3, name: "Mary Jo Smith", email: "m@e.com" }, 0);
    expect(mapped.firstName).toBe("Mary");
    expect(mapped.lastName).toBe("Jo Smith");
  });

  it("assigns department by cycling through DEPARTMENTS based on index", () => {
    DEPARTMENTS.forEach((expectedDept, index) => {
      expect(mapApiUserToAppUser(raw, index).department).toBe(expectedDept);
    });
  });

  it("wraps department assignment around when index exceeds DEPARTMENTS length", () => {
    const wrappedIndex = DEPARTMENTS.length; // one past the last department
    expect(mapApiUserToAppUser(raw, wrappedIndex).department).toBe(DEPARTMENTS[0]);
  });

  it("marks users inactive every 4th index (index % 4 === 3)", () => {
    expect(mapApiUserToAppUser(raw, 3).active).toBe(false);
    expect(mapApiUserToAppUser(raw, 7).active).toBe(false);
  });

  it("marks users active on all other indices", () => {
    expect(mapApiUserToAppUser(raw, 0).active).toBe(true);
    expect(mapApiUserToAppUser(raw, 1).active).toBe(true);
    expect(mapApiUserToAppUser(raw, 2).active).toBe(true);
  });
});

// ─── sortUsers ────────────────────────────────────────────────────────────────

describe("sortUsers", () => {
  it("sorts by firstName ascending", () => {
    const sorted = sortUsers(SAMPLE_USERS, "firstName", "asc");
    expect(sorted[0].firstName).toBe("Alice");
    expect(sorted[2].firstName).toBe("Charlie");
  });

  it("sorts by firstName descending", () => {
    const sorted = sortUsers(SAMPLE_USERS, "firstName", "desc");
    expect(sorted[0].firstName).toBe("Charlie");
  });

  it("sorts by lastName ascending", () => {
    const sorted = sortUsers(SAMPLE_USERS, "lastName", "asc");
    expect(sorted[0].lastName).toBe("Adams");
  });

  it("does not mutate the original array", () => {
    const original = [...SAMPLE_USERS];
    sortUsers(SAMPLE_USERS, "firstName", "desc");
    expect(SAMPLE_USERS).toEqual(original);
  });
});

// ─── searchUsers ─────────────────────────────────────────────────────────────

describe("searchUsers", () => {
  it("returns all users when query is empty", () => {
    expect(searchUsers(SAMPLE_USERS, "")).toHaveLength(3);
  });

  it("matches firstName case-insensitively", () => {
    const result = searchUsers(SAMPLE_USERS, "ALICE");
    expect(result).toHaveLength(1);
    expect(result[0].firstName).toBe("Alice");
  });

  it("matches lastName", () => {
    const result = searchUsers(SAMPLE_USERS, "adams");
    expect(result[0].lastName).toBe("Adams");
  });

  it("matches email", () => {
    expect(searchUsers(SAMPLE_USERS, "@b.com")).toHaveLength(1);
  });

  it("returns empty array when nothing matches", () => {
    expect(searchUsers(SAMPLE_USERS, "zzz999")).toHaveLength(0);
  });
});

// ─── applyFilters ─────────────────────────────────────────────────────────────

describe("applyFilters", () => {
  const emptyFilters = { firstName: "", lastName: "", email: "", department: "" };

  it("returns all users when filters are empty", () => {
    expect(applyFilters(SAMPLE_USERS, emptyFilters)).toHaveLength(3);
  });

  it("filters by department", () => {
    const result = applyFilters(SAMPLE_USERS, { ...emptyFilters, department: "Sales" });
    expect(result).toHaveLength(1);
    expect(result[0].department).toBe("Sales");
  });

  it("applies AND logic across multiple filters", () => {
    const result = applyFilters(SAMPLE_USERS, { ...emptyFilters, firstName: "Bob", department: "Engineering" });
    expect(result).toHaveLength(1);
    expect(result[0].firstName).toBe("Bob");
  });

  it("returns empty when filters match no users", () => {
    expect(applyFilters(SAMPLE_USERS, { ...emptyFilters, firstName: "Xavier" })).toHaveLength(0);
  });

  it("preserves the active field on filtered results untouched", () => {
    // applyFilters has no active criteria — confirms it doesn't strip
    // or alter fields it isn't filtering on
    const result = applyFilters(SAMPLE_USERS, { ...emptyFilters, department: "Sales" });
    expect(result[0].active).toBe(false);
  });
});

// ─── getPaginationIndices ─────────────────────────────────────────────────────

describe("getPaginationIndices", () => {
  it("returns startIndex 0 for page 1", () => {
    expect(getPaginationIndices(1, 10).startIndex).toBe(0);
  });

  it("returns startIndex 10 for page 2 with pageSize 10", () => {
    expect(getPaginationIndices(2, 10).startIndex).toBe(10);
  });

  it("returns correct endIndex for page 1 with pageSize 5", () => {
    expect(getPaginationIndices(1, 5).endIndex).toBe(5);
  });

  it("calculates correct indices for page 3", () => {
    const { startIndex, endIndex } = getPaginationIndices(3, 5);
    expect(startIndex).toBe(10);
    expect(endIndex).toBe(15);
  });
});

// ─── generateUniqueId ────────────────────────────────────────────────────────

describe("generateUniqueId", () => {
  it("returns max id + 1", () => {
    expect(generateUniqueId(SAMPLE_USERS)).toBe(4);
  });

  it("returns 1 for an empty list", () => {
    expect(generateUniqueId([])).toBe(1);
  });
});