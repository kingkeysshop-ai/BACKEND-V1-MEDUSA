# License Manager Implementation TODO

## ✅ Plan Approved & Understood (Medusa v2 specifics)

## 📁 1. Create Module Files [0/3]
- [ ] `backend/src/modules/license-manager/models/license-key.ts` (MikroORM model)
- [ ] `backend/src/modules/license-manager/service.ts` (MedusaService + custom methods)
- [ ] `backend/src/modules/license-manager/index.ts` (module export)

## 📧 2. Email Template [1/2]
- [ ] `backend/src/modules/email-notifications/templates/license-delivery.tsx`
- [ ] Edit `backend/src/modules/email-notifications/templates/index.tsx` (add LICENSE_DELIVERY)

## ⚙️ 3. Module Registration [0/1]
- [ ] Edit `backend/medusa-config.js` (add license-manager module)

## 🔄 4. Workflow [0/1]
- [ ] `backend/src/workflows/assign-licenses-on-order.ts` (createWorkflow + steps)

## 🔔 5. Subscriber [0/1]
- [ ] `backend/src/subscribers/order-placed-licenses.ts` (NEW file, order.placed event)

## ✅ 6. Verification [0/2]
- [ ] `cd backend && pnpm tsc --noEmit`
- [ ] Generate migration: `cd backend && pnpm medusa db:generate license-manager`

## 📄 Final Deliverables
- [ ] List of files created/modified
- [ ] CSV import example
- [ ] Commit message

**Next Step:** Create `models/license-key.ts`
