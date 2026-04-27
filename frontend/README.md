# Roxiler Systems — Frontend

## Tech Stack

- **Framework:** React 19 + Vite
- **UI Library:** shadcn/ui (Nova preset) + Tailwind CSS v4
- **State Management:** Zustand (with persistence)
- **Routing:** React Router v6
- **HTTP Client:** Axios (with interceptors + refresh token)
- **Forms:** React Hook Form + Zod

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

App runs at `http://localhost:5173`

---

## Environment Variables

Create `.env` in the frontend root:

```env
VITE_API_AXIOS_BASE_URL=http://localhost:5000/api
```

---

## Folder Structure

```
src/
├── api/
│   └── axios.js               ← Axios instance with auth + refresh interceptors
├── store/
│   └── authStore.js           ← Zustand auth store (persisted to localStorage)
├── components/
│   ├── Navbar.jsx             ← Role-aware navbar with logout
│   ├── Footer.jsx             ← App footer
│   ├── ProtectedRoute.jsx     ← Role-based route guard
│   └── ui/                   ← shadcn components
├── pages/
│   ├── Home.jsx               ← Public landing page
│   ├── auth/
│   │   ├── Login.jsx          ← Single login for all roles
│   │   └── Signup.jsx         ← Normal user registration
│   ├── admin/
│   │   ├── Dashboard.jsx      ← Stats cards
│   │   ├── Users.jsx          ← Users table + add user modal
│   │   ├── UserDetail.jsx     ← Single user detail view
│   │   └── Stores.jsx         ← Stores table + add store modal
│   ├── user/
│   │   ├── Stores.jsx         ← Store listing + rating submit/edit
│   │   └── UpdatePassword.jsx ← Password update form
│   └── storeOwner/
│       ├── Dashboard.jsx      ← Avg rating + raters table
│       └── UpdatePassword.jsx ← Password update form
└── App.jsx                    ← All routes defined here
```

---

## Routing

### Public Routes

| Route           | Page   | Description                   |
| --------------- | ------ | ----------------------------- |
| `/`             | Home   | Landing page                  |
| `/login`        | Login  | Single login for all roles    |
| `/signup`       | Signup | Normal user registration only |
| `/unauthorized` | 403    | Access denied page            |

### Admin Routes

> Requires `ADMIN` role

| Route              | Page        | Description                         |
| ------------------ | ----------- | ----------------------------------- |
| `/admin/dashboard` | Dashboard   | Total users, stores, ratings        |
| `/admin/users`     | Users       | List, filter, sort, add user        |
| `/admin/users/:id` | User Detail | Full user info + store owner rating |
| `/admin/stores`    | Stores      | List, filter, sort, add store       |

### Normal User Routes

> Requires `USER` role

| Route            | Page            | Description                        |
| ---------------- | --------------- | ---------------------------------- |
| `/user/stores`   | Stores          | Browse stores, submit/edit ratings |
| `/user/password` | Update Password | Change account password            |

### Store Owner Routes

> Requires `STORE_OWNER` role

| Route                    | Page            | Description              |
| ------------------------ | --------------- | ------------------------ |
| `/store-owner/dashboard` | Dashboard       | Avg rating + raters list |
| `/store-owner/password`  | Update Password | Change account password  |

---

## Auth Flow

1. User logs in via `POST /api/login`
2. Backend returns `user` object (with `role`) + `accessToken`
3. Zustand stores both in localStorage via `persist` middleware
4. `ProtectedRoute` reads from Zustand — redirects if no token or wrong role
5. Axios attaches token to every request via request interceptor
6. On 401 — axios tries `POST /api/refresh-token` automatically
7. If refresh fails — clears auth and redirects to `/login`
8. Logout hits `POST /api/logout` and clears Zustand store

---

## Role Based Redirects After Login

| Role          | Redirects To             |
| ------------- | ------------------------ |
| `ADMIN`       | `/admin/dashboard`       |
| `USER`        | `/user/stores`           |
| `STORE_OWNER` | `/store-owner/dashboard` |

---

## Features by Role

### Admin

- Dashboard with 3 stat cards (users, stores, ratings)
- Users table with filter by name, email, address, role
- Sort users by name, email, address, role (asc/desc)
- Add user modal (any role — USER, ADMIN, STORE_OWNER)
- View user detail — shows avg rating if Store Owner
- Stores table with filter by name, email, address
- Sort stores by name, email, address (asc/desc)
- Add store modal (requires owner ID of a STORE_OWNER)

### Normal User

- Browse all stores with search by name and address
- See overall rating and own submitted rating per store
- Submit rating (1–5 stars) via star picker modal
- Edit existing rating via same modal
- Update account password

### Store Owner

- Dashboard showing store name, address, average rating, total raters
- Table of all users who rated their store with rating given
- Update account password

---

## Form Validation Rules

| Field      | Rules                                                |
| ---------- | ---------------------------------------------------- |
| `name`     | Min 2 chars, Max 60 chars                            |
| `email`    | Valid email format                                   |
| `password` | 8–16 chars, min 1 uppercase, min 1 special character |
| `address`  | Max 400 chars                                        |
| `rating`   | Integer 1–5                                          |

---

## Test Accounts

| Role        | Email                 | Password   |
| ----------- | --------------------- | ---------- |
| Admin       | admin@roxiler.com     | Password@1 |
| User        | john.doe@gmail.com    | Password@1 |
| User        | jane.smith@gmail.com  | Password@1 |
| Store Owner | owner.pizza@gmail.com | Password@1 |
| Store Owner | owner.cafe@gmail.com  | Password@1 |
