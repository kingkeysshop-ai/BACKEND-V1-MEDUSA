import AuthorizeNetPaymentService from "./services/authorize-net-payment"
import { ModuleProvider, Modules } from "@medusajs/framework/utils"

export default ModuleProvider(Modules.PAYMENT, {
  services: [AuthorizeNetPaymentService],
})
