# Medical Camp Frontend

React + Vite + TypeScript frontend that connects directly to Supabase for authentication, profiles, and appointment data. There is no custom Express backend anymore; all data access happens through the Supabase JavaScript client with Row Level Security keeping things safe.

## Project Structure

```
src/
  app/                # Providers, layouts, route composition
  features/
    landing/          # Marketing/landing experience
    auth/             # Login & signup flows
    user/             # Patient dashboard
    admin/            # Admin dashboard
    profile/          # Profile management
  shared/             # Light shared utilities/components
  assets/             # Static assets consumed by features
```

Import aliases keep boundaries clear and avoid deep relatives:

| Alias         | Resolves to         | Purpose                              |
|---------------|---------------------|--------------------------------------|
| `@app/*`      | `src/app/*`         | Application shell, providers, router |
| `@features/*` | `src/features/*`    | Feature entry points                 |
| `@shared/*`   | `src/shared/*`      | Shared utilities/components          |
| `@assets/*`   | `src/assets/*`      | Static assets                        |
| `@providers/*`| `src/app/providers/*`| Auth context + Supabase client       |

## Install & Run

```bash
cd frontend
cp .env.example .env  # supply Supabase project keys
npm install
npm run dev
```

Required env vars:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Pages

- Landing (`/`): Overview and quick links.
- Login (`/login`): Supabase email/password auth.
- Sign Up (`/signup`): Creates Supabase auth user and optional profile row.
- User Dashboard (`/user`): Reads the current user’s appointments directly from Supabase.
- Admin Dashboard (`/admin`): Loads all appointments and user list when the signed-in user has `role = 'admin'`.
- Profile (`/profile` anchor): Displays profile information from `public.users`.

## Notes

- Ensure Supabase Row Level Security allows patients to read their own appointments and admins to read all records.
- If you track additional metadata on signup, consider adding a database trigger or Edge Function to populate `public.users` automatically.
- Adjust `frontend/src/app/providers/AuthProvider.tsx` if you change table shapes or introduce new roles.
