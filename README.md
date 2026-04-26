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
