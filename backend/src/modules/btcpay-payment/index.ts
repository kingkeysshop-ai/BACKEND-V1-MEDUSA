import { Module } from "@medusajs/framework/utils"
import BTCPayProviderService from "./services/btcpay-provider.service"

export const BTCPAY_MODULE = "btcpay_payment"

export default Module(BTCPAY_MODULE, {
  service: BTCPayProviderService,
})