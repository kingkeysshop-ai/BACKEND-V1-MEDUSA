# Railway Build Fix TODO

- [x] Update backend/src/lib/constants.ts: Add fallback env vars (DATABASE_URL, JWT_SECRET, COOKIE_SECRET)
- [x] Update backend/src/scripts/postBuild.js: Make .medusa/server check tolerant
- [ ] Commit with message "fix: add fallback env vars for Railway build time"
- [ ] git push origin main
- [ ] Verify Railway deployment success
