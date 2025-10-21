# Medical Camp Frontend

React + Vite + TypeScript frontend for the Medical-Camp project.

## Install & Run

- cd `frontend`
- `cp .env.example .env` and set:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_API_URL` (default `http://localhost:5000/api`)
- `npm install`
- `npm run dev`

Backend must allow CORS from `http://localhost:5173` (your backend already defaults to this).

## Pages

- Get Started: Overview and quick links.
- Login: Supabase email/password auth.
- Sign Up: Create account (confirmation depends on Supabase settings).
- User Home: Calls `GET /api/appointments/my` with Supabase JWT.
- Admin Home: Calls `GET /api/appointments` (admin-only).

## Notes

- The frontend uses Supabase auth; the backend validates the JWT via `supabase.auth.getUser()`.
- Authorization (admin vs user) is enforced by the backend; the frontend does not hard-enforce roles.
- To make an account admin, update the `public.users.role` field for that user in your database.

