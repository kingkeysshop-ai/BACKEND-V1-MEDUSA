# 👑 King Keys - Medusa 1.0 Monorepo

Full-stack e-commerce platform:
- **Backend**: Medusa 1.20 (Node 24 + PostgreSQL + Redis)
- **Storefront**: Next.js 15 + React 19 + Tailwind
- **Deployment**: Railway (both services)
- **Local dev**: Docker Compose (one command)

```
c:/KING KEYS S/
├── backend/                   ← Medusa 1.0 API + Admin
├── storefront/                ← Next.js customer-facing site
├── docker-compose.yml         ← one-command local dev stack
├── railway.json               ← Railway deployment config
├── railway.toml               ← Nixpacks config
└── README.md                  ← you are here
```

---

## ⚡ TL;DR — Run Everything Locally

**Windows (PowerShell / CMD):**
```bat
cd backend
docker compose up -d
```

**Linux / macOS / WSL:**
```bash
cd backend
docker compose up -d
```

This will:
1. Start PostgreSQL, Redis, MinIO
2. Run database migrations
3. Launch Medusa 1.20 backend
4. Available at http://localhost:9000

Access:
- **Admin**: http://localhost:9000/app
- **Store API**: http://localhost:9000/store
- **Health**: http://localhost:9000/health

---

## 🚀 Quick Start — Local Development

### 1. Prerequisites
- Docker & Docker Compose
- Node.js 24.x
- pnpm 9.x

### 2. Setup Backend
```bash
cd backend
cp .env.example .env
# Edit .env with your settings:
# - JWT_SECRET (generate: openssl rand -base64 48)
# - COOKIE_SECRET (generate: openssl rand -base64 48)
# - MEDUSA_ADMIN_EMAIL
# - MEDUSA_ADMIN_PASSWORD
```

### 3. Start Stack
```bash
docker compose up -d
docker compose logs -f medusa
```

### 4. Create Admin User
```bash
docker compose exec medusa pnpm medusa user -e admin@kingkeys.com -p password
```

### 5. Access Admin
Open http://localhost:9000/app and login

---

## ☁️ Deploy to Railway

### Step 1 — Create Railway Project
1. Go to https://railway.app/new → **Empty project**
2. Add **PostgreSQL** plugin
3. Add **Redis** plugin

### Step 2 — Deploy Backend
1. **+ New → GitHub Repo** → select `BACKEND-V1-MEDUSA`
2. Set **Root Directory** = `/backend`
3. Railway auto-detects `railway.json` + `railway.toml`
4. Add these environment variables:
   ```
   NODE_ENV=production
   JWT_SECRET=<long-random-string>
   COOKIE_SECRET=<long-random-string>
   MEDUSA_ADMIN_EMAIL=admin@kingkeys.com
   MEDUSA_ADMIN_PASSWORD=<strong-password>
   STORE_CORS=https://<your-storefront>.up.railway.app
   ADMIN_CORS=https://<your-backend>.up.railway.app
   AUTH_CORS=https://<your-storefront>.up.railway.app,https://<your-backend>.up.railway.app
   MEDUSA_WORKER_MODE=shared
   MEDUSA_DISABLE_ADMIN=false
   ```
5. **Settings → Networking → Generate Domain**
6. Deploy and wait for "Healthy" ✅

### Step 3 — Create Publishable Key
1. Open `https://<your-backend>.up.railway.app/app`
2. Login with admin credentials
3. Go to **Settings → Publishable API Keys → Create**
4. Copy the key (starts with `pk_`)

### Step 4 — Deploy Storefront (Optional)
1. **+ New → GitHub Repo** → select `BACKEND-V1-MEDUSA`
2. Set **Root Directory** = `/storefront`
3. Add environment variables:
   ```
   NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://<your-backend>.up.railway.app
   NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_xxx
   NEXT_PUBLIC_DEFAULT_REGION=us
   NEXT_PUBLIC_BASE_URL=https://<your-storefront>.up.railway.app
   NEXT_PUBLIC_STRIPE_KEY=pk_live_xxx (optional)
   ```
4. Deploy

### Step 5 — Update CORS
Update backend service CORS variables with the final storefront URL, then redeploy backend.

---

## 🧩 Architecture

```
┌──────────────┐      ┌──────────────┐
│ Storefront   │─────▶│   Backend    │
│ Next.js 15   │      │  Medusa 1.0  │
│ :8000        │      │  :9000       │
└──────────────┘      └──────┬───────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
       ┌────▼─────┐    ┌─────▼────┐     ┌─────▼────┐
       │ Postgres │    │  Redis   │     │  MinIO   │
       │  :5432   │    │  :6379   │     │  :9001   │
       └──────────┘    └──────────┘     └──────────┘
```

---

## 🛠️ Useful Commands

```bash
# Tail backend logs
docker compose logs -f medusa

# Exec into backend
docker compose exec backend sh

# Run seed data
docker compose exec backend pnpm run seed

# Stop everything
docker compose down

# Wipe database
docker compose down -v

# Restart backend
docker compose restart medusa
```

---

## 🐛 Troubleshooting

| Issue | Fix |
|-------|-----|
| Admin login fails | Check `MEDUSA_ADMIN_EMAIL/PASSWORD` in .env |
| `JWT_SECRET` error | Generate with: `openssl rand -base64 48` |
| CORS errors | Add storefront URL to `STORE_CORS` + `AUTH_CORS` |
| Build fails on Railway | Check logs — usually missing secrets |
| Database connection error | Verify `DATABASE_URL` on Railway |
| Storefront blank | Check `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` |

---

## 📚 Resources

- [Medusa V1 Docs](https://docs.medusajs.com)
- [Railway Docs](https://docs.railway.app)
- [Next.js Docs](https://nextjs.org/docs)
- [Medusa Discord](https://discord.gg/medusajs)

---

## 📝 License

MIT — see individual `LICENSE` files in each sub-project.
