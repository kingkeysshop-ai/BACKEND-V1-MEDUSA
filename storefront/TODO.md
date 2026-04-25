# Fix Next.js Dev Server & Hydration Errors

## Current Status
- [x] Analyzed middleware.ts error: Missing MEDUSA_BACKEND_URL
- [x] Analyzed ChakraProvider: Correct setup
- [ ] Env vars configured
- [ ] Hydration mismatch fixed  
- [ ] Dev server running cleanly

## Step-by-Step Plan

### 1. Environment Variables (Primary Blocker)
```
Add to .env.local:
MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_your_key_here
NEXT_PUBLIC_DEFAULT_REGION=us
```
**Note**: Get publishable key from Medusa Admin → Sales Channels → API Keys

### 2. Start Medusa Backend
```bash
# Navigate to backend dir (adjust path)
cd ../medusa-backend
npx medusa develop
```

### 3. Restart Storefront
```bash
cd "c:/KING KEYS S/king-keys-storefront"
npm run dev
```

### 4. Fix Hydration (if persists)
- Check src/app/layout.tsx wraps with ChakraProvider
- Clear .next cache: `rm -rf .next`

### 5. Verify
- No middleware errors
- No hydration warnings
- Visit http://localhost:8000 → redirects to /us

**Next Action**: User adds env vars → I verify layout.tsx
