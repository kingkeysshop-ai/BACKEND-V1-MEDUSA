# Railway Deployment Fix TODO

## ✅ Plan Approved & Understood (Medusa + Railway)

## 🛠️ 1. Move DB migration out of build [1/1]
- [x] Edit `backend/package.json` `build` script to remove `medusa db:migrate`

## 🚀 2. Run migration at runtime start [1/1]
- [x] Edit `backend/package.json` `start` script to run `medusa db:migrate` before server start

## ⚙️ 3. Railway command alignment [1/1]
- [x] Keep `backend/railway.toml` `startCommand = "pnpm run start"` (already correct)

## ✅ 4. Verification Steps [0/2]
- [ ] Redeploy on Railway and confirm no DB retry loop during build
- [ ] Confirm `/health` turns healthy after runtime start

## 📄 Result
- [ ] Deployment no longer blocks in build phase waiting for DB connectivity
