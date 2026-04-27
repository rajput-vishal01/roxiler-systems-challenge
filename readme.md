![Roxiler Systems](./screenshot-of-app/home/Screenshot%20(77).png)

# Roxiler Systems — Store Rating Platform

A full-stack web application where users can discover and rate stores, store owners can track their ratings, and admins can manage the entire platform.

## Project Structure

```
roxiler-systems-challenge/
├── backend/    → Express + Prisma + PostgreSQL
└── frontend/   → React + shadcn/ui + Zustand
```

## Setup

Refer to the individual READMEs for setup instructions:

- **Backend** → [`backend/README.md`](./backend/README.md)
- **Frontend** → [`frontend/README.md`](./frontend/README.md)

## Tech Stack

| Layer | Stack |
|---|---|
| Frontend | React, Vite, shadcn/ui, Zustand, React Router |
| Backend | Node.js, Express, Prisma ORM |
| Database | PostgreSQL |
| Auth | JWT (Access + Refresh Token) |

## Roles

| Role | Access |
|---|---|
| Admin | Manage users, stores, view platform stats |
| Normal User | Browse stores, submit and edit ratings |
| Store Owner | View own store's ratings and average score |