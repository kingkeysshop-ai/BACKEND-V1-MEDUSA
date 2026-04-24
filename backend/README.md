# 🛍️ King Keys — Medusa 2.0 Backend

Production-ready Medusa 2.0 backend prepared for:
- ✅ **Local development** via Docker Compose (Postgres + Redis + MinIO)
- ✅ **Railway deployment** via Nixpacks/Docker
- ✅ Stripe, Resend/SendGrid, Meilisearch, MinIO S3 integrations

---

## 🚀 Quick Start — Local (Docker)

```bash
# 1. Copy env
cp .env.example .env

# 2. Edit at minimum:
#    JWT_SECRET=xxx
#    COOKIE_SECRET=xxx
#    MEDUSA_ADMIN_EMAIL, MEDUSA_ADMIN_PASSWORD

# 3. Start everything (postgres + redis + minio + medusa)
docker compose up --build -d

# 4. Tail logs
docker compose logs -f medusa
```

### Access
| Service | URL | Credentials |
|--------|-----|-------------|
| Admin Dashboard | http://localhost:9000/app | `MEDUSA_ADMIN_EMAIL/PASSWORD` from .env |
| Store API | http://localhost:9000/store | — |
| Health | http://localhost:9000/health | — |
| MinIO Console | http://localhost:9001 | minioadmin / minioadmin |
| Postgres | localhost:5432 | medusa / medusa |
| Redis | localhost:6379 | — |

---

## 🛠️ Local Dev (without Docker)

Requires **Node 22**, **pnpm 9**, **Postgres 14+**, **Redis** (optional).

```bash
pnpm install
cp .env.example .env          # edit DATABASE_URL to your local Postgres
pnpm dev                      # auto-migrates DB and starts Medusa
```

> First boot calls `init-backend` which runs DB migrations and creates the admin user using `MEDUSA_ADMIN_EMAIL` + `MEDUSA_ADMIN_PASSWORD`.

---

## ☁️ Deploy to Railway

### 1. Create the project
1. Go to https://railway.app/new and create a new project from this GitHub repo (`backend/` folder).
2. Add the **PostgreSQL** plugin (Railway auto-provides `DATABASE_URL`).
3. Add the **Redis** plugin (auto-provides `REDIS_URL`).

### 2. Configure environment variables on the Medusa service
Copy these from your `.env.example` (generate long random strings for the secrets):

| Variable | Value |
|--------|-------|
| `NODE_ENV` | `production` |
| `JWT_SECRET` | a long random string |
| `COOKIE_SECRET` | a long random string |
| `MEDUSA_ADMIN_EMAIL` | your admin email |
| `MEDUSA_ADMIN_PASSWORD` | strong password |
| `STORE_CORS` | `https://<your-storefront>.up.railway.app` |
| `ADMIN_CORS` | `https://<your-backend>.up.railway.app` |
| `AUTH_CORS` | `https://<your-storefront>.up.railway.app,https://<your-backend>.up.railway.app` |
| `MEDUSA_WORKER_MODE` | `shared` |
| `MEDUSA_DISABLE_ADMIN` | `false` |

> `DATABASE_URL` and `REDIS_URL` are set automatically by Railway plugins.
> `BACKEND_PUBLIC_URL` falls back to Railway's `RAILWAY_PUBLIC_DOMAIN_VALUE`.

### 3. Deploy
Railway picks up `railway.toml` / `nixpacks.toml`:
- Build: `pnpm install --frozen-lockfile && pnpm run build`
- Start: `pnpm run start` (runs `init-backend` then `medusa start`)

### 4. Create publishable API key
After the first successful deploy:
1. Open `https://<your-backend>.up.railway.app/app`
2. Login with the admin credentials
3. Go to **Settings → Publishable API Keys** → Create key
4. Copy the key and paste it as `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` in the storefront service

---

## 🧪 Health Check

Medusa exposes `/health`. Railway uses this as the healthcheck path.

```bash
curl https://<your-backend>.up.railway.app/health
```

---

## 🧹 Useful Commands

```bash
# Run seed (demo products, regions, etc.)
pnpm run seed

# Run migrations manually
pnpm medusa db:migrate

# Re-create admin
pnpm medusa user -e admin@kingkeys.com -p newpassword
```

---

## 📁 Structure

```
backend/
├── Dockerfile
├── docker-compose.yml
├── medusa-config.js
├── railway.toml          ← Railway config
├── railway.json          ← alt. Railway config
├── nixpacks.toml         ← Nixpacks config
├── .env.example
└── src/
    ├── lib/constants.ts  ← env vars assertions
    ├── modules/
    │   ├── email-notifications/
    │   ├── minio-file/
    │   └── payment-medusajs/
    └── scripts/
        ├── postBuild.js
        └── seed.ts
```

## ❓ Troubleshooting

- **`Cannot read properties of null (reading 'admin')`** → Make sure `JWT_SECRET` and `COOKIE_SECRET` are set.
- **Build fails on Railway: `pnpm not found`** → `nixpacks.toml` declares `pnpm-9_x` via Nix.
- **CORS errors on storefront** → Add the storefront URL to `STORE_CORS` and `AUTH_CORS`.
- **Images broken on storefront** → Configure `MINIO_*` vars or use `@medusajs/file-local` (default when MinIO empty).
