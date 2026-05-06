import { ModuleProviderExports } from "@medusajs/framework/types"
import { MedusaJsPaymentService } from "./services/medusajs-payment"

const services = [MedusaJsPaymentService]

const moduleDefinition: ModuleProviderExports = {
  services,
}

export default moduleDefinition
