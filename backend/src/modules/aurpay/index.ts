import AurpayPaymentService from "./services/aurpay-payment"
import { ModuleProvider, Modules } from "@medusajs/framework/utils"

export default ModuleProvider(Modules.PAYMENT, {
  services: [AurpayPaymentService],
})
