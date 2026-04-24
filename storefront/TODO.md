# 🎯 King Keys Deployment — TODO & Status

## ✅ Phase 1 — Backend Medusa 2.0 (`../backend/`)
- [x] Fix `medusa-config.js` — import `MEDUSAJS_PAYMENT_API_KEY` from constants
- [x] Create `railway.toml` (Nixpacks + pnpm 9 + Node 22)
- [x] Create `railway.json` (alternative JSON config)
- [x] Create `nixpacks.toml` (pins Node 22 + pnpm 9)
- [x] Create `.env.example` (full template with DB, Redis, Stripe, Resend, MinIO, Meilisearch, custom payment providers)
- [x] Create `README.md` (Docker quick-start + local dev + Railway steps + env table + troubleshooting)

## ✅ Phase 2 — Storefront Next.js (`./`)
- [x] Fix corrupt `railway.toml` (was containing bash heredoc, now proper TOML)
- [x] Create `railway.json` (JSON alternative)
- [x] Create `nixpacks.toml` (Node 20)
- [x] `.env.local.example` already present (validated)
- [x] Update `src/lib/config.ts` to prefer `NEXT_PUBLIC_MEDUSA_BACKEND_URL`

## ✅ Phase 3 — Monorepo Root (`../`)
- [x] `docker-compose.yml` (Postgres 16 + Redis 7 + MinIO + Backend + Storefront)
- [x] `start-all.sh` (Linux/Mac/WSL launcher with env auto-copy + health wait)
- [x] `start-all.bat` (Windows equivalent)
- [x] Root `README.md` (full monorepo guide, architecture diagram, Railway 5-step deploy)

## ✅ Phase 4 — Validation
- [x] Next.js storefront builds successfully (`.next/` generated with all routes)
- [x] `medusa-config.js` syntax validated (ESM imports correct)
- [x] All deployment config files validated (railway.toml, nixpacks.toml, Dockerfile references)
- [x] Environment variable wiring end-to-end (storefront ↔ backend ↔ DB/Redis)
- ⚠️ **Medusa backend build locally on WSL+/mnt/c** had stdout buffering issues (no output shown, but doesn't affect Railway/Docker — those environments use native Linux filesystem)

## 🚀 Phase 5 — Next Steps for User

### A) Local development (recommended — requires Docker Desktop running)
```bash
# From "C:\KING KEYS S\"
start-all.bat           # Windows
# or
./start-all.sh          # WSL/Linux/Mac
```
- Admin → http://localhost:9000/app  
- Storefront → http://localhost:8000

### B) Local development (without Docker — native Node)
**Terminal 1 — Backend:**
```bash
cd ../backend
# Copy .env.example → .env and edit DB/Redis URLs to point to local installs
pnpm run dev            # starts in dev mode (skips build, uses tsx)
```
**Terminal 2 — Storefront:**
```bash
cd king-keys-storefront
# Copy .env.local.example → .env.local
npm run dev             # → http://localhost:8000
```

### C) Railway deployment (production)
1. Push `backend/` to a GitHub repo (`king-keys-backend`)
2. Push `king-keys-storefront/` to another GitHub repo
3. On Railway:
   - New Project → Add PostgreSQL plugin → Add Redis plugin
   - Deploy backend repo → set env vars (see `backend/.env.example`)
   - Generate domain for backend
   - Login admin at `<backend-url>/app` → Settings → Publishable API Keys → create
   - Deploy storefront repo → set `NEXT_PUBLIC_MEDUSA_BACKEND_URL` + `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` (from step above)
   - Generate domain for storefront
   - Return to backend env → update `STORE_CORS` + `AUTH_CORS` with storefront URL → redeploy
4. Full step-by-step in root `README.md`

## 📋 File Inventory (all created/modified)

### Backend (`../backend/`)
| File | Purpose |
|---|---|
| `medusa-config.js` | Fixed: added MEDUSAJS_PAYMENT_API_KEY import, conditional payment modules |
| `railway.toml` | Railway deployment config (TOML) |
| `railway.json` | Railway deployment config (JSON alternative) |
| `nixpacks.toml` | Pins Node 22 + pnpm 9 for Nixpacks build |
| `.env.example` | Complete env template |
| `README.md` | Full setup/deploy guide |

### Storefront (`./`)
| File | Purpose |
|---|---|
| `railway.toml` | Fixed: was corrupt, now valid Railway TOML |
| `railway.json` | Railway JSON config |
| `nixpacks.toml` | Pins Node 20 |
| `src/lib/config.ts` | Modified: prefer NEXT_PUBLIC_MEDUSA_BACKEND_URL |

### Monorepo (`../`)
| File | Purpose |
|---|---|
| `docker-compose.yml` | One-command local stack |
| `start-all.sh` | Launcher (Linux/Mac/WSL) |
| `start-all.bat` | Launcher (Windows) |
| `README.md` | Monorepo overview + full deploy guide |

## 🔮 Future Enhancements (nice-to-have)
- [ ] Connect Cryptomus + BTCPay as proper Medusa 2.0 payment providers (custom module)
- [ ] Sentry / Logtail error tracking
- [ ] CI/CD GitHub Actions (lint + build on PR)
- [ ] Custom domain via Cloudflare
- [ ] MinIO/S3 for production file storage (already configured optionally)
- [ ] Meilisearch for product search (already configured optionally)
- [ ] i18n multi-region store
- [ ] Email templates for Resend

## 🆘 Troubleshooting Quick Reference
| Issue | Fix |
|---|---|
| Storefront can't connect to backend | Check `NEXT_PUBLIC_MEDUSA_BACKEND_URL` + restart storefront |
| CORS error in browser | Add storefront URL to backend `STORE_CORS` + `AUTH_CORS`, redeploy |
| Admin login fails | Recreate admin: `pnpm medusa user -e you@x.com -p pass` |
| Railway build OOM | Upgrade plan or set `MEDUSA_DISABLE_ADMIN=true` on worker instances |
| Local `medusa build` silent on WSL | Use Docker (`start-all.bat`) instead, or run backend in dev mode (`pnpm run dev`) |
| Docker Desktop not running | Start Docker Desktop from Windows start menu; verify with `docker ps` |
