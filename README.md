# Phishing Forensics Sandbox

A full-stack phishing analysis demo with:
- React + Vite + Tailwind SOC dashboard
- Node.js + Express rule-based phishing engine
- No DB (scan history stored in frontend `localStorage`)

## Project Structure

- frontend/ → React dashboard
- backend/ → Express API (`POST /api/analyze`)

## Quick Start (2 minutes)

### 1) Start backend

```bash
cd backend
npm install
npm run dev
```

API runs at `http://localhost:6000`

### 2) Start frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`

## Sample Request

`POST http://localhost:6000/api/analyze`

```json
{
  "input": "URGENT: Your account has been suspended. Verify now by clicking here: http://secure-paypa1-login.xyz/verify"
}
```

## Safety Constraints

- Text-only rule analysis
- No opening real links
- No scraping
- No redirects
- No external API calls

## Deployment (Render + Vercel)

This project is split deployment:

- Backend API -> Render
- Frontend dashboard -> Vercel

### 1) Deploy backend on Render

1. In Render, click **New** -> **Blueprint**.
2. Connect this GitHub repository.
3. Render auto-detects [render.yaml](render.yaml).
4. Deploy and copy your backend URL, for example:

`https://phishing-forensics-sandbox-backend.onrender.com`

Health check:

`GET https://<your-render-url>/`

API endpoint:

`POST https://<your-render-url>/api/analyze`

### 2) Deploy frontend on Vercel

1. In Vercel, import the same GitHub repository.
2. Set **Root Directory** to `frontend`.
3. Framework preset: **Vite**.
4. Add env variable:

- Key: `VITE_API_BASE_URL`
- Value: `https://<your-render-url>/api`

5. Deploy.

### 3) Optional CORS hardening

In Render backend service environment variables, set:

- `FRONTEND_URL=https://<your-vercel-domain>`

You can pass multiple origins as comma-separated values.
