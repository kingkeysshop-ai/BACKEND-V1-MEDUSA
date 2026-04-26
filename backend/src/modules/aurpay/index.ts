import AurpayPaymentService from "./services/aurpay-payment"
import { Module } from "@medusajs/framework/utils"

export const AURPAY_MODULE = "aurpay"
export default Module(AURPAY_MODULE, { service: AurpayPaymentService })
