# Integrar Resend como notification provider

## ✅ Completado previamente
- [x] Paquete resend instalado
- [x] Módulo/services/resend.ts implementado  
- [x] Módulo index.ts exporta service
- [x] Subscriber order-placed.ts envía ORDER_PLACED
- [x] Env vars configurados en medusa-config.js

## ⏳ Pendiente
1. [ ] Crear TODO.md (este archivo)
2. [ ] Fix medusa-config.js: path './src/modules/resend' → './src/modules/email-notifications'
3. [ ] Crear templates/password-reset.tsx (HTML inline, asunto "Recuperá tu contraseña", link reset)
4. [ ] Update templates/index.tsx: agregar PASSWORD_RESET enum, typeguard, generateEmailTemplate case
5. [ ] Verificar evento password reset de Medusa v2
6. [ ] Probar implementación

## Pruebas
- `pnpm run email:dev`
- curl admin notifications
- Place test order
