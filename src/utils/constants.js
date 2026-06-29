// Base URL for all JSONPlaceholder API requests
export const API_URL = "https://jsonplaceholder.typicode.com/users";

// Available department options used in forms and filters
export const DEPARTMENTS = ["IT", "Engineering", "Sales", "HR", "Finance", "Marketing"];

// Default department assigned when API data has no department field
export const DEFAULT_DEPARTMENT = "IT";

// Pagination page-size options shown in the dropdown
export const PAGE_SIZE_OPTIONS = [5, 10, 25, 50, 100];

// Default number of rows shown per page on initial load
export const DEFAULT_PAGE_SIZE = 5;

// Column definitions — now includes Status column for the redesign
export const TABLE_COLUMNS = [
  { key: "id",         label: "ID",         sortable: true  },
  { key: "firstName",  label: "Name",        sortable: true  },
  { key: "department", label: "Department",  sortable: true  },
  { key: "email",      label: "Email",       sortable: true  },
  { key: "active",     label: "Status",      sortable: false },
  { key: "actions",    label: "",            sortable: false },
];