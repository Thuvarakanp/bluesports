# Deployment Guide

This app has two parts that deploy separately:

- **Frontend** (`client/`, React + Vite) → **Vercel**
- **Backend** (`server/`, Express + MongoDB) → **Render**
- **Database** → **MongoDB Atlas** (already set up)
- **PDF storage** → **Cloudinary** (durable; local disk does not persist on cloud hosts)

Deploy the **backend first** so you know its URL, then point the frontend at it.

---

## 0. Before you start — security

Your old `server/.env` was committed to git, so the MongoDB password is in the
repo history. It has now been removed from tracking, but you should:

1. **Rotate the MongoDB password** in Atlas (Database Access → Edit user → new password),
   then update `MONGODB_URI` everywhere.
2. **Set a strong `JWT_SECRET`** (any long random string).
3. **Set a strong `ADMIN_PASSWORD`**.

---

## 1. Cloudinary (PDF storage)

1. Sign up free at https://cloudinary.com.
2. On the Dashboard copy: **Cloud name**, **API Key**, **API Secret**.
3. You'll paste these into Render as `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`,
   `CLOUDINARY_API_SECRET`.

---

## 2. Backend → Render

1. Push this repo to GitHub.
2. Go to https://render.com → **New +** → **Web Service** → connect the repo.
   (Or use **Blueprint** — it reads the included `render.yaml`.)
3. Settings if doing it manually:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add **Environment Variables** (see `server/.env.example`):
   - `MONGODB_URI` — your Atlas connection string
   - `JWT_SECRET` — long random string
   - `ADMIN_USERNAME` / `ADMIN_PASSWORD`
   - `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET`
   - `CLIENT_URL` — set after step 3 (your Vercel URL), then redeploy
5. Deploy. Test: open `https://<your-service>.onrender.com/api/health` → should return `{"status":"ok"}`.

> **Atlas note:** In Atlas → Network Access, allow access from anywhere (`0.0.0.0/0`)
> so Render can connect, or add Render's outbound IPs.

> **Free tier note:** Render free services sleep after inactivity; the first
> request after sleeping takes ~30–60s to wake.

---

## 3. Frontend → Vercel

1. Go to https://vercel.com → **Add New** → **Project** → import the repo.
2. Settings:
   - **Root Directory:** `client`
   - Framework preset: **Vite** (auto-detected)
   - Build Command: `npm run build` · Output Directory: `dist` (defaults are fine)
3. Add **Environment Variable**:
   - `VITE_API_URL` = your Render backend URL, e.g. `https://sports-meet-server.onrender.com`
     (no trailing slash)
4. Deploy. Copy the resulting Vercel URL.

---

## 4. Connect the two

1. Back in **Render**, set `CLIENT_URL` to your Vercel URL and redeploy.
2. Visit your Vercel URL. Log in to `/admin`, upload a PDF, and confirm it opens.

---

## Local development

```bash
# Backend
cd server
cp .env.example .env   # fill in values (Cloudinary optional locally)
npm install
npm run dev            # http://localhost:5000

# Frontend (new terminal)
cd client
npm install
npm run dev            # http://localhost:3000  (proxies /api to :5000)
```

Locally, leave `VITE_API_URL` unset — the Vite dev proxy in `vite.config.js`
forwards `/api` and `/uploads` to the backend. Without Cloudinary keys, uploads
fall back to local disk under `server/uploads/`.
