// ...existing code...
# Medical Camp

Full-stack TypeScript app: Express + Supabase backend and React + Vite frontend for appointment management (user/admin roles).

## Quick links
- Backend: [backend/package.json](backend/package.json) · [backend/src/server.ts](backend/src/server.ts) · [backend/src/app.ts](backend/src/app.ts)
- Frontend: [frontend/package.json](frontend/package.json) · [frontend/vite.config.ts](frontend/vite.config.ts)
- Env samples: [frontend/.env.example](frontend/.env.example) · [backend/.env](backend/.env)
- Audit / notes: [Project_Readme.md](Project_Readme.md)

## Tech
- Backend: Node + Express + TypeScript, Supabase JS client, Zod validation, CORS, dotenv.
- Frontend: React + Vite + TypeScript, Supabase auth, axios.

## Important source symbols
- Auth middleware: [`protect`](backend/src/middleware/authMiddleware.ts) · [`authorize`](backend/src/middleware/authMiddleware.ts)
- Appointment controllers: [`createAppointment`](backend/src/controllers/appointmentController.ts), [`getUserAppointments`](backend/src/controllers/appointmentController.ts), [`getAllAppointments`](backend/src/controllers/appointmentController.ts), [`updateAppointmentStatus`](backend/src/controllers/appointmentController.ts)
- User controller: [`getAllUsers`](backend/src/controllers/userController.ts)
- Supabase config (server): [backend/src/config/supabase.ts](backend/src/config/supabase.ts)
- Frontend auth: [`AuthProvider`](frontend/src/context/AuthContext.tsx) · [`useAuth`](frontend/src/context/AuthContext.tsx) · [`supabase`](frontend/src/context/AuthContext.tsx)
- Frontend API client: [`api`](frontend/src/lib/api.ts)
- Validation schemas: [backend/src/utils/validation.ts](backend/src/utils/validation.ts)
- Request augmentation types: [backend/src/types/custom.d.ts](backend/src/types/custom.d.ts)

## Environment
Backend expects env in `backend/.env` (or set env when running). Key vars:
- SUPABASE_URL
- SUPABASE_ANON_KEY (server uses anon by default; consider SERVICE_ROLE_KEY for privileged ops)
- PORT (default 5000)
- FRONTEND_URL or FRONTEND_URLS (CORS)

Frontend env (copy from): [frontend/.env.example](frontend/.env.example)
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- VITE_API_URL (defaults to `http://localhost:5000/api`)

## Run (development)

Backend:
1. cd backend
2. npm install
3. ensure `backend/.env` exists (or set env)
4. npm run dev
- Dev entry: [backend/package.json#scripts.dev](backend/package.json)

Frontend:
1. cd frontend
2. npm install
3. cp .env.example .env and fill Supabase vars
4. npm run dev
- Dev entry: [frontend/package.json#scripts.dev](frontend/package.json)

## Build & production
- Backend build: `cd backend && npm run build` → outputs to `backend/dist` (see [backend/tsconfig.json](backend/tsconfig.json)).
- Frontend build: `cd frontend && npm run build`

## Notes & recommendations
- The backend validates Supabase JWTs via [`protect`](backend/src/middleware/authMiddleware.ts) and enforces roles with [`authorize`](backend/src/middleware/authMiddleware.ts).
- Read the project audit for known issues and migration suggestions: [Project_Readme.md](Project_Readme.md).
- Keep service role keys out of source control. Use `SUPABASE_SERVICE_ROLE_KEY` only on trusted server processes.
- Ensure CORS allows your frontend origin (default http://localhost:5173) — configured in [backend/src/app.ts](backend/src/app.ts).

## File map (high level)
- backend/src/
  - [app.ts](backend/src/app.ts), [server.ts](backend/src/server.ts), [config/supabase.ts](backend/src/config/supabase.ts)
  - [controllers/appointmentController.ts](backend/src/controllers/appointmentController.ts)
  - [controllers/userController.ts](backend/src/controllers/userController.ts)
  - [middleware/authMiddleware.ts](backend/src/middleware/authMiddleware.ts)
  - [utils/validation.ts](backend/src/utils/validation.ts)
  - [types/custom.d.ts](backend/src/types/custom.d.ts)
- frontend/
  - [src/context/AuthContext.tsx](frontend/src/context/AuthContext.tsx)
  - [src/lib/api.ts](frontend/src/lib/api.ts)
  - [src/pages/*](frontend/src/pages) (GetStarted, Login, Signup, UserHome, AdminHome)

## Support
See [Project_Readme.md](Project_Readme.md) for an audit, recommended fixes, and run/debug tips.