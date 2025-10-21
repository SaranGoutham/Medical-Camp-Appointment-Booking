# Medical-Camp Backend — Project Overview & Audit

This document explains the purpose and function of each source file, outlines the current architecture and API, and highlights issues with clear, actionable recommendations.

---

## High-Level Overview

- Stack: TypeScript, Node.js, Express, Supabase (Auth + Postgres), Zod (validation), CORS, dotenv.
- Purpose: Backend API for a medical camp app to register users and manage appointments, with role-based access (user/admin) enforced via middleware backed by Supabase Auth and a `public.users` table.
- Key ideas:
  - Auth: Frontend obtains a Supabase JWT; backend verifies it via `supabase.auth.getUser(token)`.
  - Authorization: Backend looks up the user’s role from `public.users` and gates routes via middleware.
  - Data: Appointments stored in `public.appointments` with a foreign key to `public.users`.

---

## Directory Structure (project root)

- `src/`
  - `app.ts`: Express app wiring (middleware, routes, error handler)
  - `server.ts`: App entrypoint (port/env, starts server)
  - `config/supabase.ts`: Supabase client initialization
  - `controllers/`: Request handlers (users, appointments)
  - `middleware/authMiddleware.ts`: AuthN + role-based AuthZ
  - `routes/`: Express routers for resources
  - `interfaces/`: Shared TypeScript interfaces (domain models)
  - `utils/validation.ts`: Zod schemas
  - `types/custom.d.ts`: Express `Request` augmentation
- `backend/`
  - `package.json`: Scripts + dependencies
  - `tsconfig.json`: TypeScript compiler config (expects `backend/src`)
  - `.env`: Environment variables (not committed in production)
  - `node_modules/`: Installed packages

Note: Source code currently lives at repository root `src/`, while `backend/tsconfig.json` and scripts expect `backend/src`. See “Problems” below.

---

## Runtime Flow

1. Client calls API with a `Bearer` JWT in `Authorization` header (issued by Supabase).
2. `protect` middleware verifies the token via `supabase.auth.getUser(token)` and populates `req.user` with id/email/role from `public.users`.
3. `authorize([...])` checks that `req.user.role` is allowed for the route.
4. Controllers perform validated reads/writes using Supabase client.
5. JSON response returned to client.

---

## API Surface

- `GET /api/health`
  - Health check; returns `{ status: 'ok' }`.

- Users (admin only):
  - `GET /api/users/` → list of users (id, email, name, phone, age, address, role, created_at)

- Appointments (user):
  - `POST /api/appointments/` → create appointment (body: `{ date: YYYY-MM-DD, time: HH:MM }`)
  - `GET /api/appointments/my` → list your appointments

- Appointments (admin):
  - `GET /api/appointments/` → list all appointments (joined with user name/email)
  - `PUT /api/appointments/:id/status` → update status to one of `Booked|Confirmed|Completed|Cancelled`

---

## File-by-File Explanation

- `src/server.ts`
  - Purpose: Application entrypoint. Loads env vars and starts Express server on `PORT` (default `5000`).
  - Notes: Calls `dotenv.config` with a path relative to `src`, then `app.listen`.

- `src/app.ts`
  - Purpose: Creates and configures Express app.
  - Responsibilities:
    - `express.json()` for JSON parsing
    - `cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true })`
    - Mounts routers: `/api/users`, `/api/appointments`
    - `GET /api/health` endpoint
    - Basic error handler (currently returns plain text)

- `src/config/supabase.ts`
  - Purpose: Initialize Supabase client used across controllers/middleware.
  - Reads env: `SUPABASE_URL`, `SUPABASE_ANON_KEY` and `process.exit(1)` if missing.
  - Exports: `supabase` client instance.

- `src/middleware/authMiddleware.ts`
  - Exports:
    - `protect` (async):
      - Extracts JWT from `Authorization: Bearer <token>`
      - Validates via `supabase.auth.getUser(token)`
      - Fetches role from `public.users` by `id`
      - Attaches `req.user = { id, email, role }` and `req.supabase = authUser`
    - `authorize(roles: Array<'user' | 'admin'>)`: Ensures `req.user.role` is permitted

- `src/controllers/userController.ts`
  - `getAllUsers`: Admin-only; selects `id, email, name, phone, age, address, role, created_at` from `public.users` ordered by `created_at desc`.

- `src/controllers/appointmentController.ts`
  - `createAppointment`:
    - Validates body via `newAppointmentSchema`
    - Enforces no duplicate active appointment for same user/date/time (ignoring `Cancelled`)
    - Inserts appointment with status `Booked`
  - `getUserAppointments`:
    - Returns current user’s appointments ordered by date/time
  - `getAllAppointments` (admin):
    - Selects all appointments and joins `users (name, email)`
    - Flattens result into `{ ..., user_name, user_email }`
  - `updateAppointmentStatus` (admin):
    - Validates status via `updateAppointmentStatusSchema`
    - Updates `appointments.status` by id; returns updated row

- `src/routes/userRoutes.ts`
  - `GET /` → `protect` + `authorize(['admin'])` → `getAllUsers`

- `src/routes/appointmentRoutes.ts`
  - User:
    - `POST /` → `protect` + `authorize(['user'])` → `createAppointment`
    - `GET /my` → `protect` + `authorize(['user'])` → `getUserAppointments`
  - Admin:
    - `GET /` → `protect` + `authorize(['admin'])` → `getAllAppointments`
    - `PUT /:id/status` → `protect` + `authorize(['admin'])` → `updateAppointmentStatus`

- `src/routes/authRoutes.ts`
  - Currently empty. Not mounted anywhere. Either implement or remove.

- `src/interfaces/index.ts`
  - `User` interface: matches `public.users` columns, including `role: 'user' | 'admin'`.
  - `Appointment` interface: domain model for appointments, plus optional `user_name`/`user_email` for admin view.

- `src/utils/validation.ts`
  - `newAppointmentSchema`: Zod schema ensuring `date` is `YYYY-MM-DD` and `time` is `HH:MM`.
  - `updateAppointmentStatusSchema`: Zod enum for valid statuses with a clear error message.

- `src/types/custom.d.ts`
  - Augments Express `Request` to include `user?: { id, email, role }` and `supabase?: SupabaseAuthUser | null`.
  - Ensures TypeScript recognizes `req.user`/`req.supabase` set by middleware.

- `backend/package.json`
  - Scripts:
    - `dev`: `ts-node-dev --respawn --transpile-only src/server.ts`
    - `build`: `tsc`
    - `start`: `node dist/server.js`
    - `postbuild`: copies `.env` to `dist/.env`
  - Dependencies: express, dotenv, cors, zod, @supabase/supabase-js, etc.

- `backend/tsconfig.json`
  - `rootDir: ./src`, `outDir: ./dist`, `module: CommonJS`, `target: ES2020`.
  - Includes `src/**/*.ts` and `src/**/*.js`.

- `backend/.env`
  - Holds environment variables like `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `PORT`, `FRONTEND_URL`.
  - Do not commit real secrets to version control.

---

## Problems & Risks

1. Project layout mismatch
   - `backend/tsconfig.json` and `backend/package.json` scripts expect code in `backend/src`, but the actual source is at repository root `src/`.
   - Consequence: `npm run dev` from `backend` fails because `backend/src/server.ts` does not exist; build output paths and type-checking are misaligned.

2. Environment file path confusion
   - `src/server.ts` loads `.env` from `__dirname + '/../.env'` (repo root), but the actual `.env` is under `backend/.env`.
   - `src/config/supabase.ts` loads from `__dirname + '/../../.env'` (repo root) yet the error message references `backend/.env`.
   - Consequence: Env vars may not load in dev; misleading error message; deployment ambiguity.

3. dotenv load order
   - `server.ts` imports `app` before calling `dotenv.config`. If modules read env during import (e.g., `app.ts` CORS origin), values may be undefined unless fallback is used.

4. Empty `src/routes/authRoutes.ts`
   - Dead file; not mounted. Either implement auth endpoints or remove to reduce confusion.

5. TypeScript config and declaration inclusion
   - `backend/tsconfig.json` includes `src/**/*.ts` but not `*.d.ts`; although TS often picks up `.d.ts`, the include path is rooted at `backend`, not the actual `src` location.
   - Consequence: `src/types/custom.d.ts` may be ignored by the current config, leading to TS errors on `req.user`.

6. Unused imports and stylistic inconsistencies
   - `User`/`Appointment` imports in controllers are not used.
   - Error handler returns plain text whereas the API otherwise returns JSON.

7. Supabase key choice on server
   - Using `SUPABASE_ANON_KEY` on the server restricts admin operations. If server needs privileged actions (bypassing RLS), consider `SUPABASE_SERVICE_ROLE_KEY` with care and never expose it to the client.

8. Assumptions on DB schema and RLS
   - Code assumes a `public.users` table keyed to `auth.users.id` and that `appointments.user_id → users.id` FK exists with proper RLS policies.
   - Risk: If schema or policies aren’t set, queries/joins/filters may fail or leak data.

9. CORS defaults and environment reliance
   - Defaults to `http://localhost:5173` if `FRONTEND_URL` is missing; fine for dev, but ensure correct origin in production.

10. Missing tests, linting, and documentation
   - No automated tests, linter, or README. Harder to validate behavior and maintain standards.

---

## Recommendations (Actionable)

- Choose a cohesive project root:
  - Option A (recommended): Move `src/` into `backend/src/`, keep Node project self-contained in `backend/`.
  - Option B: Move `backend/package.json` and `tsconfig.json` to repository root and adjust paths to target root `src/`.

- Fix .env paths and load order:
  - Call `dotenv.config()` before importing modules that read env vars.
  - Standardize one location for `.env` (e.g., `backend/.env` if using Option A) and update paths with `path.resolve`.

- Remove or implement `src/routes/authRoutes.ts`.

- Align error responses:
  - Return structured JSON from the error handler to keep responses consistent.

- Clean up TypeScript imports and config:
  - Remove unused imports.
  - Ensure `src/types/custom.d.ts` is included by the active `tsconfig.json`.

- Supabase keys and policies:
  - Keep `ANON_KEY` for unprivileged server actions or switch to `SERVICE_ROLE_KEY` only where necessary; store in server-side env only.
  - Verify RLS policies align with route expectations (users see their own data; admin can see all).

- Add basic CI hygiene:
  - Add README with setup/run instructions; add ESLint/Prettier; consider minimal tests for controllers.

---

## Environment Variables

- `SUPABASE_URL`: Project URL from Supabase.
- `SUPABASE_ANON_KEY`: Anon public key for client-like operations.
- `SUPABASE_SERVICE_ROLE_KEY` (optional): Service role key for privileged server ops.
- `PORT`: Server port (e.g., `5000`).
- `FRONTEND_URL`: Allowed CORS origin (e.g., `http://localhost:5173`).

Keep secrets out of version control and your logs.

---

## How To Run (after addressing structure)

- If using Option A (move `src` into `backend/src`):
  - `cd backend`
  - `npm install`
  - `cp .env.example .env` and fill values (or keep existing `.env`)
  - Dev: `npm run dev`
  - Build: `npm run build`
  - Start: `npm start`

- If using Option B (promote `backend` to root):
  - Move `package.json` and `tsconfig.json` to root and update paths to `src/`.
  - Run the same scripts from repository root.

---

## Final Notes

- The core app structure (middleware → controllers → Supabase) is sound and easy to extend.
- Biggest blocker is the project layout/env path mismatch. Fixing these will make the server runnable and predictable across dev/prod.

