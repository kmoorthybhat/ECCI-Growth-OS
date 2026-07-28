# ECCI Growth OS — Enterprise Cloudflare Architecture & Deployment Guide

This document provides a comprehensive overview of the Cloudflare edge infrastructure configuration for **ECCI Growth OS**, including comparison between `wrangler.toml` and `wrangler.jsonc`, pre-deployment checklist, and step-by-step CLI deployment commands across Development, Staging, and Production environments.

---

## 1. Enterprise Infrastructure Architecture & Resource Bindings

ECCI Growth OS leverages Cloudflare's developer platform to provide high-concurrency, edge-native compute, AI intelligence, real-time state management, and asynchronous processing.

| Resource Type | Binding Name | Target Cloudflare Service | Application Module / Consumer |
| :--- | :--- | :--- | :--- |
| **D1 Database** | `DB` | Cloudflare D1 Relational DB | CRM, Customer Portal, Billing & Auth State |
| **KV Namespace** | `CACHE` | Cloudflare KV | API Gateway Response Caching & Static Configs |
| **KV Namespace** | `SESSIONS` | Cloudflare KV | User Auth Tokens & Short-Lived Stateful Sessions |
| **KV Namespace** | `CONFIG` | Cloudflare KV | White-Label Agency Branding & Tenant Settings |
| **R2 Storage** | `ASSETS` | Cloudflare R2 | Marketing Media, Image Assets & Video Clips |
| **R2 Storage** | `REPORTS` | Cloudflare R2 | AI Executive PDF Reports & Campaign Analytics |
| **Queues** | `BACKGROUND_QUEUE` | Cloudflare Queues | Social Media Automation, Async Emails & Webhooks |
| **Durable Objects**| `AI_AGENT` | Durable Object (`AIAgentSessionManager`) | Real-Time AI Agent Stateful Chat & Multi-Turn Tasks |
| **Durable Objects**| `WORKFLOW_ENGINE`| Durable Object (`WorkflowEngine`) | Multi-Step Campaign Orchestration & Automation |
| **Vectorize** | `VECTOR_INDEX` | Cloudflare Vectorize | Semantic Knowledge Retrieval & AI Search Engine |
| **Workers AI** | `AI` | Cloudflare Workers AI | On-Edge Small Language Model Inferences & Embeddings |
| **Browser** | `BROWSER` | Cloudflare Browser Rendering | Automated Web Scraping, Visual Screenshots & PDFs |
| **Analytics** | `ANALYTICS` | Analytics Engine (`ecci_analytics`) | Real-Time Platform Performance & Telemetry Logs |
| **Hyperdrive** | `HYPERDRIVE` | Cloudflare Hyperdrive | Accelerated SQL Connection Pooling & Latency Reduction |

---

## 2. Comparison Table: `wrangler.toml` vs `wrangler.jsonc`

Both configuration files describe identical infrastructure capabilities and environment setups. Below is a comparison of their key structural syntax features:

| Feature / Aspect | `wrangler.toml` (TOML) | `wrangler.jsonc` (JSONC) |
| :--- | :--- | :--- |
| **Syntax Style** | Key-value pairs with bracketed headers `[section]` | Standard JSON object tree with curly braces `{}` |
| **Comments Support** | Native line comments using `#` | Single-line `//` and multi-line `/* */` comments |
| **Array of Tables** | Double brackets `[[d1_databases]]`, `[[kv_namespaces]]` | Native JSON array of objects `[{ "binding": "..." }]` |
| **Schema Validation** | Validated via Wrangler CLI parser | Supports `$schema: "node_modules/wrangler/config-schema.json"` for IDE auto-completion |
| **Environment Overrides** | `[env.dev]`, `[env.staging]` sub-headers | `"env": { "dev": { ... }, "staging": { ... } }` nested objects |
| **Readability** | High human readability for flat parameters | Highly structured for programmatic generation & CI/CD tools |
| **Wrangler Preference** | Default format supported across all versions | Modern recommended format for IDE intellisense & strict typing |

---

## 3. Post-Generation Pre-Deployment Checklist

Before deploying ECCI Growth OS to Cloudflare, replace all template placeholders (`<YOUR_*_ID>`) with actual Cloudflare resource IDs provisioned in your Cloudflare dashboard or via Wrangler CLI:

- [ ] **D1 Database IDs**:
  - Replace `<YOUR_PRODUCTION_D1_DATABASE_ID>` in `d1_databases[0]`
  - Replace `<YOUR_STAGING_D1_DATABASE_ID>` in `env.staging.d1_databases[0]`
  - Replace `<YOUR_DEV_D1_DATABASE_ID>` in `env.dev.d1_databases[0]`

- [ ] **KV Namespace IDs**:
  - Replace `<YOUR_PRODUCTION_CACHE_KV_ID>`, `<YOUR_PRODUCTION_SESSIONS_KV_ID>`, and `<YOUR_PRODUCTION_CONFIG_KV_ID>`
  - Replace matching Staging and Development KV namespace IDs in `env.staging` and `env.dev`

- [ ] **Hyperdrive Connection IDs**:
  - Replace `<YOUR_PRODUCTION_HYPERDRIVE_ID>` with your production database connection pool ID

- [ ] **Custom Domain DNS Routes**:
  - Ensure DNS CNAME / AAAA records in Cloudflare DNS point to:
    - `dev.eccigrowthos.com` (Development)
    - `staging.eccigrowthos.com` (Staging)
    - `api.eccigrowthos.com` (Production)

---

## 4. Deployment & Operations Guide (Wrangler CLI)

### Step 1: Authenticate with Cloudflare
```bash
npx wrangler login
```

### Step 2: Provision Infrastructure Resources

#### A. Create D1 Databases
```bash
npx wrangler d1 create ecci-db-dev
npx wrangler d1 create ecci-db-staging
npx wrangler d1 create ecci-db-prod
```

#### B. Create KV Namespaces
```bash
npx wrangler kv namespace create CACHE_KV
npx wrangler kv namespace create SESSION_KV
npx wrangler kv namespace create CONFIG_KV
```

#### C. Create R2 Buckets
```bash
npx wrangler r2 bucket create ecci-assets-dev
npx wrangler r2 bucket create ecci-assets-staging
npx wrangler r2 bucket create ecci-assets-prod

npx wrangler r2 bucket create ecci-reports-dev
npx wrangler r2 bucket create ecci-reports-staging
npx wrangler r2 bucket create ecci-reports-prod
```

#### D. Create Vectorize Indices
```bash
npx wrangler vectorize create ecci-vector-index-dev --dimensions=1536 --metric=cosine
npx wrangler vectorize create ecci-vector-index-staging --dimensions=1536 --metric=cosine
npx wrangler vectorize create ecci-vector-index-prod --dimensions=1536 --metric=cosine
```

#### E. Create Queues
```bash
npx wrangler queues create ecci-background-queue-dev
npx wrangler queues create ecci-background-queue-staging
npx wrangler queues create ecci-background-queue-prod
```

---

### Step 3: Provision Production Secrets

Run the following commands to securely set secrets for your worker environment:

```bash
# AI & Intelligence Keys
npx wrangler secret put GEMINI_API_KEY
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put ANTHROPIC_API_KEY

# Social & Marketing Credentials
npx wrangler secret put META_APP_SECRET
npx wrangler secret put META_ACCESS_TOKEN
npx wrangler secret put GOOGLE_CLIENT_SECRET
npx wrangler secret put GOOGLE_API_KEY
npx wrangler secret put GOOGLE_MAPS_KEY

# Email Services
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put SENDGRID_API_KEY
npx wrangler secret put MAILGUN_API_KEY

# Payment & Auth
npx wrangler secret put STRIPE_SECRET_KEY
npx wrangler secret put PAYPAL_CLIENT_SECRET
npx wrangler secret put JWT_SECRET
npx wrangler secret put ENCRYPTION_KEY
npx wrangler secret put WEBHOOK_SECRET

# Workspace & Integrations
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
npx wrangler secret put NOTION_API_KEY
npx wrangler secret put SLACK_BOT_TOKEN
```

---

### Step 4: Local Testing & Validation

#### Validate Wrangler Syntax
```bash
npx wrangler config validate
```

#### Local Development Server with Cloudflare Bindings Emulation
```bash
# Build static web frontend
npm run build

# Start Wrangler emulation with local Functions and static assets
npx wrangler pages dev dist --env dev
```

---

### Step 5: Multi-Stage Deployment Commands

#### Deploy to Development
```bash
npx wrangler deploy --env dev
```

#### Deploy to Staging
```bash
npx wrangler deploy --env staging
```

#### Deploy to Production
```bash
npx wrangler deploy --env production
```
