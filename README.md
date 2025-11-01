# Medical Camp

Supabase-first appointment management UI built with React, Vite, and TypeScript. The app talks directly to Supabase for auth, profile data, and appointment records—no custom backend required.

## Quick links
- Frontend entry: [frontend/src/main.tsx](frontend/src/main.tsx)
- Auth context: [frontend/src/app/providers/AuthProvider.tsx](frontend/src/app/providers/AuthProvider.tsx)
- User dashboard: [frontend/src/features/user/pages/UserDashboardPage.tsx](frontend/src/features/user/pages/UserDashboardPage.tsx)
- Admin dashboard: [frontend/src/features/admin/pages/AdminDashboardPage.tsx](frontend/src/features/admin/pages/AdminDashboardPage.tsx)
- Project notes: [Project_Readme.md](Project_Readme.md)

## Tech
- React 18 + Vite + TypeScript
- Supabase JS client for auth and data queries
- Feature-oriented file layout with path aliases for ergonomics

## Environment
Create `frontend/.env` with:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Additional optional vars:
- `VITE_SUPABASE_REDIRECT_URL` (if using email links)

## Run (development)
```bash
cd frontend
npm install
cp .env.example .env  # then fill the Supabase values
npm run dev
```

## Build
```bash
cd frontend
npm run build
```
Outputs production assets to `frontend/dist`.

## Supabase Expectations
- Table `public.users` stores profile metadata (`id`, `email`, `name`, `role`).
- Table `public.appointments` stores appointment records (`user_id`, `date`, `time`, `status`).
- Row Level Security rules should allow patients to select their own appointments and admins (role = `admin`) to view every record.
- Optional trigger or client logic should populate `public.users` when a new account is created.

## File map (high level)
- `frontend/src/app/` – providers, layouts, route registry
- `frontend/src/features/landing/` – marketing and get-started flows
- `frontend/src/features/auth/` – login and signup pages
- `frontend/src/features/user/` – patient dashboard
- `frontend/src/features/admin/` – admin dashboard
- `frontend/src/features/profile/` – shared profile components
- `frontend/src/shared/` – small shared utilities/components

## Questions?
See [Project_Readme.md](Project_Readme.md) for historical context and outstanding todos.
