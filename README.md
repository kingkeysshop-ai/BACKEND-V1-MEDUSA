# 👑 King Keys - Medusa 2.0 Monorepo

Full-stack e-commerce platform:
- **Backend**: Medusa 2.13 (Node 22 + PostgreSQL + Redis)
- **Storefront**: Next.js 15 + React 19 + Tailwind
- **Deployment**: Railway (both services)
- **Local dev**: Docker Compose (one command)

```
c:/KING KEYS S/
├── backend/                   ← Medusa 2.0 API + Admin
├── king-keys-storefront/      ← Next.js customer-facing site
├── docker-compose.yml         ← one-command local dev stack
├── start-all.sh               ← Linux/Mac/WSL launcher
├── start-all.bat              ← Windows launcher
└── README.md                  ← you are here
```

---

## ⚡ TL;DR — Run Everything Locally

**Windows (PowerShell / CMD):**
```bat
cd "c:\KING KEYS S"
start-all.bat
```

**Linux / macOS / WSL:**
```bash
cd "/mnt/c/KING KEYS S"   # or your path
chmod +x start-all.sh
./start-all.sh
```

This will:
1. Copy `backend/.env.example` → `backend/.env` (if missing)
2. Copy `king-keys-storefront/.env.local.example` → `king-keys-storefront/.env.local` (if missing)
3. Launch Postgres, Redis, MinIO, Backend, Storefront in Docker
4. Wait for backend `/health`

Then:
- Admin: http://localhost:9000/app
- Store: http://localhost:8000

---

## 🔐 First-Time Setup

### 1. Edit secrets
Open `backend/.env` and change:
```
JWT_SECRET=<generate-long-random-string>
COOKIE_SECRET=<generate-another-random-string>
MEDUSA_ADMIN_EMAIL=you@yourdomain.com
MEDUSA_ADMIN_PASSWORD=<strong-password>
```

> Generate secrets: `openssl rand -base64 48`

### 2. Start the stack
```bash
./start-all.sh      # or start-all.bat on Windows
```

### 3. Create publishable API key
1. Go to http://localhost:9000/app
2. Login with `MEDUSA_ADMIN_EMAIL` / `MEDUSA_ADMIN_PASSWORD`
3. **Settings → Publishable API Keys → Create**
4. Copy the key (starts with `pk_`)
5. Paste into `king-keys-storefront/.env.local`:
   ```
   NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_xxxxx
   ```
6. Restart storefront:
   ```bash
   docker compose restart storefront
   ```

### 4. (Optional) Seed demo data
```bash
docker compose exec backend pnpm run seed
```

---

## ☁️ Deploy to Railway

Deploy **two separate services** in **one Railway project**.

### Step 1 — Create Railway project
1. https://railway.app/new → **Empty project**
2. Add Plugin: **PostgreSQL**
3. Add Plugin: **Redis**

### Step 2 — Deploy Backend
1. **+ New → GitHub Repo** → pick the repo for `backend/`
2. Set **Root Directory** = `/` if the backend repo is standalone, or `/backend` if monorepo.
3. Railway auto-detects `railway.toml` + `nixpacks.toml`.
4. **Variables** (add these - see `backend/.env.example`):
   - `NODE_ENV=production`
   - `JWT_SECRET=<long-random>`
   - `COOKIE_SECRET=<long-random>`
   - `MEDUSA_ADMIN_EMAIL=you@domain.com`
   - `MEDUSA_ADMIN_PASSWORD=<strong>`
   - `STORE_CORS=https://<storefront>.up.railway.app`
   - `ADMIN_CORS=https://<backend>.up.railway.app`
   - `AUTH_CORS=https://<storefront>.up.railway.app,https://<backend>.up.railway.app`
   - `MEDUSA_WORKER_MODE=shared`
   - `MEDUSA_DISABLE_ADMIN=false`
5. `DATABASE_URL` + `REDIS_URL` auto-injected from plugins.
6. **Settings → Networking → Generate Domain**.
7. Deploy. Wait for "Healthy".

### Step 3 — Create publishable key
Open `https://<backend>.up.railway.app/app`, login, create a publishable API key.

### Step 4 — Deploy Storefront
1. **+ New → GitHub Repo** → pick `king-keys-storefront`
2. Root Directory = `/`
3. Railway auto-detects `railway.toml` + `nixpacks.toml`.
4. **Variables**:
   - `NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://<backend>.up.railway.app`
   - `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_xxx` (from step 3)
   - `NEXT_PUBLIC_DEFAULT_REGION=us`
   - `NEXT_PUBLIC_BASE_URL=https://<storefront>.up.railway.app`
   - `NEXT_PUBLIC_STRIPE_KEY=pk_live_xxx` (optional)
5. **Settings → Networking → Generate Domain** (e.g. `king-keys-storefront.up.railway.app`).
6. Deploy.

### Step 5 — Update CORS
Go back to backend service variables and set `STORE_CORS`, `AUTH_CORS` to include the storefront's final URL, then redeploy backend.

---

## 🧩 Architecture

```
┌──────────────┐      ┌──────────────┐
│ Storefront   │─────▶│   Backend    │
│ Next.js 15   │      │  Medusa 2.0  │
│ :8000        │      │  :9000       │
└──────────────┘      └──────┬───────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
       ┌────▼─────┐    ┌─────▼────┐     ┌─────▼────┐
       │ Postgres │    │  Redis   │     │  MinIO   │
       │  :5432   │    │  :6379   │     │  :9100   │
       └──────────┘    └──────────┘     └──────────┘
```

---

## 🛠️ Commands Cheat Sheet

```bash
# Start everything
docker compose up -d

# Tail logs
docker compose logs -f backend
docker compose logs -f storefront

# Restart a service
docker compose restart storefront

# Rebuild after code changes in backend Dockerfile
docker compose up --build backend

# Stop everything
docker compose down

# Nuclear: wipe DB too
docker compose down -v

# Exec into backend container
docker compose exec backend sh

# Run seed
docker compose exec backend pnpm run seed

# Create admin user manually
docker compose exec backend pnpm medusa user -e admin@kk.com -p password
```

---

## 🐛 Troubleshooting

| Issue | Fix |
|-------|-----|
| Storefront shows "Cannot connect to backend" | Verify `NEXT_PUBLIC_MEDUSA_BACKEND_URL` + restart storefront |
| `CORS` error in browser console | Add storefront URL to `STORE_CORS` + `AUTH_CORS` in backend env, redeploy |
| Admin login fails | Check `MEDUSA_ADMIN_EMAIL/PASSWORD` in backend env, or recreate: `pnpm medusa user -e … -p …` |
| Railway backend stuck at "Deploying" | Check logs — usually missing `JWT_SECRET` or `COOKIE_SECRET` |
| Build OOM on Railway | Upgrade to a plan with more memory, or disable admin (`MEDUSA_DISABLE_ADMIN=true`) for worker instances |
| Local storefront blank | `docker compose logs storefront` — probably missing `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` |

---

## 📚 References

- Medusa 2.0 docs: https://docs.medusajs.com/v2
- Railway docs: https://docs.railway.app
- Medusa Next.js starter: https://github.com/medusajs/nextjs-starter-medusa

---

## 📝 License

MIT — see individual `LICENSE` files in each sub-project.
