import BTCPayProviderService from "./services/btcpay-provider.service";

export default {
  resolve: "./services/btcpay-provider.service", // Ojo: a veces Medusa 2.0 requiere esto
  // O si es un módulo de Medusa 2.0 estándar:
  // main: "./services/btcpay-provider.service"
};

// O si es una configuración de módulo:
// export default class BTCPayPaymentModule { ... }