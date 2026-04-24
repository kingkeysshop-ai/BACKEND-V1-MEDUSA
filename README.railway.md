# 🚀 King Keys - Despliegue Railway (5 Minutos)

## 📁 Estructura Monorepo
```
store-mas-server/
├── backend/           # Medusa 2.0 + Plugins (Stripe, Meilisearch, Custom Payments)
├── king-keys-storefront/ # Next.js Storefront
├── docker-compose.yml # Local dev
└── start-all.bat/sh   # Local 1-click
```

## **Backend (Medusa) - https://github.com/kingkeysshop-ai/store-mas-server/tree/main/backend**

### Pasos:
```
1. Railway.app → New Project → GitHub → store-mas-server
2. Root Directory: backend/
3. Add Plugins: PostgreSQL + Redis
4. Copiar TODAS las variables de backend/.env.example
```

**Variables Críticas:**
```
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=super-secreto-32-chars
COOKIE_SECRET=otro-secreto-32-chars
STRIPE_API_KEY=sk_test_...
MEDUSAJS_PAYMENT_API_KEY=tu-custom-key
STORE_CORS=https://*.railway.app
```

```
5. 🚀 Deploy → https://tu-backend.railway.app
6. Admin: https://tu-backend.railway.app/app
7. Settings → API Keys → Create Publishable Key → Copiar pk_...
```

## **Storefront - https://github.com/kingkeysshop-ai/store-mas-server/tree/main/king-keys-storefront**

### Pasos:
```
1. Railway → New Project → GitHub → store-mas-server  
2. Root Directory: king-keys-storefront/
3. Variables:
   NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://tu-backend.railway.app
   NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_xxx (del paso 7)
```

```
4. 🚀 Deploy → https://tu-storefront.railway.app
5. Backend → Variables → STORE_CORS/AUTH_CORS += storefront URL → Redeploy
```

## ✅ Verificación Final
```
Admin: https://backend.railway.app/app → Login admin@kingkeys.com/Admin123!
Store: https://storefront.railway.app → Products → Cart → Stripe Checkout
```

## 🆘 Troubleshooting
| Error | Fix |
|-------|-----|
| CORS | Backend STORE_CORS += storefront URL |
| No connect | NEXT_PUBLIC_MEDUSA_BACKEND_URL correcta |
| Stripe fail | Verificar webhook secret |

**Local:** `start-all.bat` (Windows) / `./start-all.sh`
