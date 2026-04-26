# Roxiler Systems — Backend API

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma v6
- **Auth:** JWT (Access + Refresh Token)
- **Validation:** Zod

---

## Getting Started

```bash
# 1. Start PostgreSQL via Docker
docker compose up -d

# 2. Run migrations
npx prisma migrate dev

# 3. Seed initial admin + test data
npx prisma db seed

# 4. Start dev server
npm run dev
```

Server runs at `http://localhost:5000`

---

## Environment Variables

```env
PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"
ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=7d
```

---

## Authentication

All protected routes require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <accessToken>
```

Tokens are issued on login and signup.

---

## User Roles

| Role | Value |
|---|---|
| System Administrator | `ADMIN` |
| Normal User | `USER` |
| Store Owner | `STORE_OWNER` |

---

## API Reference

### Auth Routes
**Base:** `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/signup` | ❌ | Register as normal user |
| POST | `/login` | ❌ | Login for all roles |
| POST | `/logout` | ✅ Any | Logout current user |
| POST | `/refresh-token` | ❌ | Refresh access token |

#### POST `/api/auth/signup`
```json
{
  "name": "John Doe Normal User Here",
  "email": "john.doe@gmail.com",
  "password": "Password@1",
  "address": "456 User Lane Delhi India"
}
```

#### POST `/api/auth/login`
```json
{
  "email": "john.doe@gmail.com",
  "password": "Password@1"
}
```

#### POST `/api/auth/refresh-token`
```json
{
  "refreshToken": "your_refresh_token_here"
}
```

---

### Admin Routes
**Base:** `/api/admin`
**Auth:** `ADMIN` role required

| Method | Endpoint | Description |
|---|---|---|
| GET | `/dashboard` | Total users, stores, ratings count |
| GET | `/users` | List all users with filter + sort |
| POST | `/users` | Add new user (any role) |
| GET | `/users/:id` | Get user detail (+ avg rating if Store Owner) |
| GET | `/stores` | List all stores with filter + sort |
| POST | `/stores` | Add new store |

#### GET `/api/admin/dashboard`
No body. Returns:
```json
{
  "totalUsers": 5,
  "totalStores": 2,
  "totalRatings": 3
}
```

#### GET `/api/admin/users`
No body. Supports query params:

| Param | Example | Description |
|---|---|---|
| `name` | `?name=john` | Filter by name |
| `email` | `?email=gmail` | Filter by email |
| `address` | `?address=mumbai` | Filter by address |
| `role` | `?role=USER` | Filter by role |
| `sortBy` | `?sortBy=name` | Sort field (name, email, address, role) |
| `order` | `?order=desc` | Sort direction (asc, desc) |

#### POST `/api/admin/users`
```json
{
  "name": "Alice Johnson Normal User",
  "email": "alice.johnson@gmail.com",
  "password": "Password@1",
  "address": "123 Main Street Hyderabad India",
  "role": "USER"
}
```
> `role` can be `USER`, `ADMIN`, or `STORE_OWNER`

#### GET `/api/admin/users/:id`
No body. If user is a `STORE_OWNER`, response includes `averageRating`.

#### GET `/api/admin/stores`
No body. Supports query params:

| Param | Example | Description |
|---|---|---|
| `name` | `?name=pizza` | Filter by name |
| `email` | `?email=store` | Filter by email |
| `address` | `?address=pune` | Filter by address |
| `sortBy` | `?sortBy=name` | Sort field (name, email, address) |
| `order` | `?order=asc` | Sort direction (asc, desc) |

#### POST `/api/admin/stores`
```json
{
  "name": "Bob Smith Burger House Restaurant",
  "email": "burgerhouse@store.com",
  "address": "456 Market Road Chennai India",
  "ownerId": 4
}
```
> `ownerId` must be the ID of a user with role `STORE_OWNER`

---

### User Routes
**Base:** `/api/user`
**Auth:** `USER` role required

| Method | Endpoint | Description |
|---|---|---|
| PUT | `/password` | Update own password |
| GET | `/stores` | List all stores with own rating |
| POST | `/ratings` | Submit a rating for a store |
| PUT | `/ratings` | Update an existing rating |

#### PUT `/api/user/password`
```json
{
  "oldPassword": "Password@1",
  "newPassword": "NewPass@99"
}
```

#### GET `/api/user/stores`
No body. Supports query params:

| Param | Example | Description |
|---|---|---|
| `name` | `?name=pizza` | Search by store name |
| `address` | `?address=pune` | Search by address |
| `sortBy` | `?sortBy=name` | Sort field (name, address) |
| `order` | `?order=desc` | Sort direction (asc, desc) |

Returns `overallRating` and `userRating` (current user's submitted rating) per store.

#### POST `/api/user/ratings`
```json
{
  "storeId": 1,
  "value": 4
}
```
> `value` must be between 1 and 5

#### PUT `/api/user/ratings`
```json
{
  "storeId": 1,
  "value": 2
}
```

---

### Store Owner Routes
**Base:** `/api/store-owner`
**Auth:** `STORE_OWNER` role required

| Method | Endpoint | Description |
|---|---|---|
| PUT | `/password` | Update own password |
| GET | `/dashboard` | View store avg rating + list of raters |

#### PUT `/api/store-owner/password`
```json
{
  "oldPassword": "Password@1",
  "newPassword": "NewPass@99"
}
```

#### GET `/api/store-owner/dashboard`
No body. Returns:
```json
{
  "store": {
    "id": 1,
    "name": "Pizza Palace",
    "address": "12 Food Street Pune Maharashtra",
    "averageRating": "4.5",
    "raters": [
      {
        "id": 2,
        "name": "John Doe Normal User Here",
        "email": "john.doe@gmail.com",
        "ratingGiven": 4
      }
    ]
  }
}
```

---

## Form Validation Rules

| Field | Rules |
|---|---|
| `name` | Min 2 chars, Max 60 chars |
| `email` | Valid email format |
| `password` | 8–16 chars, min 1 uppercase, min 1 special character |
| `address` | Max 400 chars |
| `rating value` | Integer between 1 and 5 |

---