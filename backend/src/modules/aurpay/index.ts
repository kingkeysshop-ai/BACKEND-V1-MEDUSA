import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import AurpayPaymentService from "./services/aurpay-payment"

export default ModuleProvider(Modules.PAYMENT, {
  services: [AurpayPaymentService],
})