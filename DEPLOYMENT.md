# Deployment Guide (all on Vercel)

The whole app runs as **one Vercel project**:

- **Frontend** (`client/`, React + Vite) → served as static files
- **Backend** (`server/`, Express) → runs as a Vercel **serverless function** via [api/index.js](api/index.js)
- **Database** → **MongoDB Atlas** (already set up)
- **PDF storage** → **Cloudinary** (durable; Vercel's filesystem is read-only)

Frontend and API share the same domain, so there is no CORS or API-URL setup —
the frontend calls `/api/...` on its own origin.

## How it fits together

| Path | Served by |
|------|-----------|
| `/api/*` | Express app (serverless function) — see [vercel.json](vercel.json) rewrite |
| everything else | `client/dist/index.html` (SPA) |

---

## 1. Security first

The old `server/.env` (with the MongoDB password) was committed in earlier git
history. Before going live:

1. **Rotate the MongoDB password** in Atlas → Database Access → Edit user.
2. Use a strong **`JWT_SECRET`** and **`ADMIN_PASSWORD`**.
3. In Atlas → **Network Access**, allow `0.0.0.0/0` so Vercel can connect.

## 2. Cloudinary (PDF storage)

1. Sign up free at https://cloudinary.com.
2. Dashboard → copy **Cloud name**, **API Key**, **API Secret**.

## 3. Set environment variables in Vercel

Project → **Settings → Environment Variables** (see [server/.env.example](server/.env.example)):

| Variable | Value |
|----------|-------|
| `MONGODB_URI` | your Atlas connection string |
| `JWT_SECRET` | long random string |
| `ADMIN_USERNAME` | admin login name |
| `ADMIN_PASSWORD` | strong password |
| `CLOUDINARY_CLOUD_NAME` | from Cloudinary |
| `CLOUDINARY_API_KEY` | from Cloudinary |
| `CLOUDINARY_API_SECRET` | from Cloudinary |

> Do **not** set `VITE_API_URL` — same-origin, so it must stay empty.
> After adding/changing env vars, **redeploy** for them to take effect.

## 4. Deploy

- **Via Claude / Vercel integration:** already wired — a deploy can be triggered for you.
- **Via dashboard:** Import the GitHub repo `Thuvarakanp/bluesports`. Vercel reads
  [vercel.json](vercel.json) automatically. Leave Root Directory at the repo root.
- **Via CLI:** `npm i -g vercel` then `vercel` (and `vercel --prod`) from the repo root.

After deploy: open `https://<your-app>.vercel.app/api/health` → should return `{"status":"ok"}`.
Then log in at `/admin/login`, upload a PDF, and confirm it opens.

---

## Notes & limits

- **Upload size:** Vercel serverless requests are capped (~4.5 MB on Hobby). Keep
  result PDFs under that. (The code allows more, but the platform limits the body.)
- **Cold starts:** the first request after idle takes a second or two while the DB
  connection warms up; it is cached afterwards.
- Without the Cloudinary variables set, PDF uploads fail on Vercel (the local-disk
  fallback only works during local development).

---

## Local development

```bash
# Backend
cd server
cp .env.example .env   # fill in MONGODB_URI etc. (Cloudinary optional locally)
npm install
npm run dev            # http://localhost:5000

# Frontend (new terminal)
cd client
npm install
npm run dev            # http://localhost:3000  (proxies /api to :5000)
```

Locally the Vite dev proxy in `client/vite.config.js` forwards `/api` and
`/uploads` to the backend, and without Cloudinary keys uploads fall back to
`server/uploads/`.
