# UserHub — User Management Dashboard

A full-featured admin dashboard for managing users, departments, and analytics — built with React.js and powered by the JSONPlaceholder REST API.

🚀 **Live Demo:** [https://userhub-misbah.netlify.app](https://userhub-misbah.netlify.app)
---

## Project Overview

UserHub is a responsive, role-based user management application that allows administrators to perform complete CRUD (Create, Read, Update, Delete) operations on user data. Regular users get read-only access to view dashboards, analytics, and department data.

**Key Features:**
- Full CRUD user management
- Real-time search, multi-field filtering, and column sorting
- Role-based access control (Administrator / User)
- Department and analytics views
- Real-time activity tracking and notifications
- Responsive UI across desktop, tablet, and mobile

---

## Installation Instructions

Make sure you have **Node.js v18+** and **npm** installed, then run:

```bash
git clone https://github.com/your-username/user-management-dashboard.git
cd user-management-dashboard
npm install
```

---

## Running the Project

**Development server:**
```bash
npm run dev
```
App will be available at `http://localhost:5173`

**Production build:**
```bash
npm run build
npm run preview
```

**Run tests:**
```bash
npm test
```

---

## Folder Structure

```
user-management-dashboard/
│
├── public/
│
├── src/
│    ├── api/
│    │    └── userService.js        # Axios API layer (GET, POST, PUT, DELETE)
│    │
│    ├── components/
│    │    ├── Header.jsx            # Sidebar navigation and branding
│    │    ├── UserTable.jsx         # Sortable data grid
│    │    ├── UserRow.jsx           # Individual row with actions
│    │    ├── UserForm.jsx          # Add / Edit modal form
│    │    ├── SearchBar.jsx         # Real-time search input
│    │    ├── FilterPopup.jsx       # Multi-criteria filter panel
│    │    ├── Pagination.jsx        # Page controls and size selector
│    │    ├── ConfirmDelete.jsx     # Delete confirmation modal
│    │    ├── StatsRow.jsx          # Summary stat cards
│    │    ├── Analytics.jsx         # Analytics charts and tables
│    │    ├── Departments.jsx       # Department breakdown view
│    │    ├── DashboardOverview.jsx # Dashboard landing view
│    │    ├── NotificationsPanel.jsx# Activity log panel
│    │    └── SettingsPanel.jsx     # User preferences panel
│    │
│    ├── context/
│    │    └── AuthContext.jsx       # Auth state and role management
│    │
│    ├── hooks/
│    │    └── useUsers.js           # Custom hook for all user CRUD operations
│    │
│    ├── pages/
│    │    ├── AuthRouter.jsx        # Auth routing logic
│    │    ├── LoginPage.jsx         # Sign in page
│    │    └── SignupPage.jsx        # Sign up page
│    │
│    ├── utils/
│    │    ├── validators.js         # Form validation functions
│    │    ├── constants.js          # Shared constants (API URL, departments, page sizes)
│    │    └── helpers.js            # Search, filter, sort, pagination utilities
│    │
│    ├── styles/
│    │    ├── App.css               # Global layout and design tokens
│    │    └── components.css        # Component-level styles
│    │
│    ├── App.jsx                    # Root component with shared state
│    └── main.jsx                   # Application entry point
│
└── README.md
```

---

## Libraries Used

| Library | Version | Purpose |
|---|---|---|
| React | 18.3.1 | UI component framework |
| React DOM | 18.3.1 | DOM rendering |
| Axios | 1.7.2 | HTTP requests to JSONPlaceholder API |
| Vite | 5.3.1 | Build tool and dev server |
| Vitest | 1.6.0 | Unit testing framework |

> React Router was not required — routing between auth and dashboard is handled via component state in `AuthRouter.jsx`.

---

## Engineering Assumptions

Since JSONPlaceholder's `/users` endpoint does not provide all required fields, the following programmatic assumptions were applied during data mapping in `helpers.js`:

**1. Name Splitting**
The API returns a single `name` field (e.g. `"Leanne Graham"`). This is split on the first space to extract:
- `firstName` → `"Leanne"`
- `lastName` → `"Graham"`

Multi-word last names (e.g. `"Van Der Berg"`) are handled by joining all parts after the first space.

**2. Department Assignment**
The API has no department field. Departments are assigned by cycling through a predefined list:
`["IT", "Engineering", "Sales", "HR", "Finance", "Marketing"]`
Each user is assigned a department based on their index position in the API response.

**3. Active / Inactive Status**
The API has no status field. Users are assigned alternating Active/Inactive status based on index (even = Active, odd = Inactive) to produce a realistic dataset for demonstration purposes.

**4. JSONPlaceholder Read-Only Limitation**
JSONPlaceholder simulates POST, PUT, and DELETE responses but does not actually persist data. All mutations (add, edit, delete) are reflected immediately in local React state to keep the UI in sync, even though the backend resets on every page load.

---

## Challenges Faced

**1. Fake API Limitations**
JSONPlaceholder only provides 10 users and does not persist any changes. This was handled by managing all state locally in React and using the API purely for simulated HTTP responses.

**2. Missing Data Fields**
The API schema does not include firstName, lastName, department, or status fields. Custom mapping logic was written in `helpers.js` to derive these values programmatically.

**3. Role-Based Access Without a Backend**
A full auth system was implemented using React Context (`AuthContext.jsx`) with a demo admin account, without any real backend or token system.

**4. Pagination with Filtering and Sorting**
Combining search, filter, sort, and pagination in the correct order required a carefully structured `useMemo` pipeline in `App.jsx` to avoid stale state bugs.

---

## Future Improvements

- **Real Backend Integration** — Replace JSONPlaceholder with a real REST API or database (e.g. Node.js + Express + PostgreSQL)
- **Persistent Authentication** — Add JWT-based auth with token storage and protected routes via React Router
- **React Router** — Implement deep linking so users can bookmark specific views (e.g. `/users`, `/analytics`)
- **Advanced Sorting** — Multi-column sort with priority ordering
- **Export Features** — Download user list as CSV or PDF
- **Dark Mode** — Toggle between light and dark themes
- **Pagination Enhancement** — Infinite scroll as an alternative to page-based navigation
- **Real-time Updates** — WebSocket integration for live activity tracking across sessions

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Administrator | admin@userhub.app | admin123 |

> Administrator accounts have full CRUD access. New sign-ups receive read-only User access by default.

---

## Author

**Misbah Samann**  
Built as part of a React.js user management dashboard project.