# ECCI Growth OS — Testing & Local Development Guide

This guide details how to configure local environment secrets and execute testing for ECCI Growth OS frontend and Cloudflare Pages Functions.

---

## 1. Local Secrets Setup

Cloudflare Pages Functions load environment variables and secrets locally from `.dev.vars`.

1. Copy the template secrets file to create your local `.dev.vars`:
   ```bash
   cp .dev.vars.example .dev.vars
   ```

2. Open `.dev.vars` and insert your actual API keys:
   ```env
   GEMINI_API_KEY="your_actual_gemini_api_key"
   PAYTM_MID="ECCI_PAYTM_MID_PROD"
   ```

---

## 2. Local Development & Functions Execution

### A. React App + Dev Server
To run the Vite development server with Express proxy middleware:
```bash
npm run dev
```
The app will be accessible at `http://localhost:3000`.

### B. Testing Cloudflare Pages Functions Locally with Wrangler
To emulate the Cloudflare Pages edge runtime locally alongside your static build output:
```bash
# Build the Vite application to dist/
npm run build

# Start the local Cloudflare Pages emulate server with Functions and local secrets
npx wrangler pages dev dist --binding GEMINI_API_KEY=your_key --binding PAYTM_MID=ECCI_PAYTM_MID_PROD
```

---

## 3. API Endpoints Testing Checklist

| Path | Method | Payload / Example Request | Expected Response |
| :--- | :--- | :--- | :--- |
| `/api/health` | `GET` | None | `{ "status": "ok", "service": "ECCI Growth OS v1.0 API Engine" }` |
| `/api/scan-website` | `POST` | `{ "websiteUrl": "https://energizecafe.com" }` | Structured `brand_kit` object |
| `/api/generate-intelligence` | `POST` | `{ "brand_kit": { ... } }` | Persona array and `bi_engine` |
| `/api/generate-text-creative` | `POST` | `{ "personaName": "Founder Alex", "adAngle": "Focus" }` | Direct response headlines, primary texts & landing copy |
| `/api/generate-visual-creative` | `POST` | `{ "title": "Matcha Pass", "primaryColor": "#FF4D00" }` | Visual aspect ratio URLs & compliance scores |
| `/api/generate-video-script` | `POST` | `{ "adAngle": "Bio-Optimized Nitro", "personaName": "Alex" }` | TikTok/Reels storyboard, voiceover & script |
| `/api/optimize-budget` | `POST` | `{ "campaigns": [{ "id": "c1", "dailyBudget": 100, "ctr": 3.4, "cpl": 12 }] }` | Budget adjustment suggestions |
| `/api/generate-report` | `POST` | `{ "clientName": "Energize Cult Cafe", "spend": 1800, "leads": 86 }` | Executive performance summary report |
| `/api/billing/paypal/create-subscription` | `POST` | `{ "clientId": "c123", "tier": "Growth", "paymentType": "monthly" }` | Approval URL & subscription order details |
| `/api/billing/paypal/capture` | `POST` | `{ "clientId": "c123", "tier": "Growth" }` | Completed transaction object |
| `/api/billing/paytm/initiate` | `POST` | `{ "clientId": "c123", "amount": 1999 }` | Paytm checksum params & payment link |
| `/api/billing/paytm/callback` | `POST` | `{ "ORDER_ID": "PAYTM_ORD_123", "STATUS": "TXN_SUCCESS" }` | Verified transaction object |
| `/api/agency/domain/verify` | `POST` | `{ "agencyId": "a1", "customDomain": "client.agency.com" }` | Verified CNAME & TXT DNS challenge status |
| `/api/agency/branding/update` | `POST` | `{ "agencyId": "a1", "branding": { "primaryColor": "#7C3AED" } }` | Updated branding confirmation & cache purge |
| `/api/agency/resolve-theme` | `GET` | `?host=client.agency.com` | Resolved tenant white-label branding |

---

## 4. Build & Production Verification

Before committing changes, run:
```bash
# Typecheck & linting
npm run lint

# Production compilation
npm run build
```
Verify that `dist/index.html` exists and that `functions/` contains all Cloudflare Pages edge route handlers.
