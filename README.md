# Waga Hackaton frontends

Two Vite + React apps wired to the live Waga API.

| App | Folder | Dev port | Purpose |
|---|---|---|---|
| Consumer | `Consumer_app/` | 8443 | Public NGO / market browser |
| Admin | `Admin_app/` | 8444 | Ops console (JWT) |

## API

```env
VITE_API_URL=https://waga-2h0w.onrender.com/api/v1
```

OpenAPI: https://waga-2h0w.onrender.com/docs

## Run

```bash
cd Consumer_app
npm install
npm run dev

cd ../Admin_app
npm install
npm run dev
```

## Admin login

Use a real admin from the API (seeded):

- Email: `admin@waga.com`
- Password: `AdminPassword12!` (or whatever was set via `waga-seed-admin`)

## What is live vs mock

**Consumer (live):** `/prices/current` hydrated into price cards, `/affordability` + `/copilot/ask` on home.

**Admin (live):** `/auth/login`, `/admin/agent-applications` approve/reject, dashboard stats when JWT present.

Other screens may still use localStorage demo data.
