import { Module } from "@medusajs/framework";
import { BTCPayProviderService } from "./services/btcpay-provider.service";

export const BTCPayPaymentModule = Module({
  moduleId: "btcpay-payment",
  service: BTCPayProviderService,
});

export default BTCPayPaymentModule;
