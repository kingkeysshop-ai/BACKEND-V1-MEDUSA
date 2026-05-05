import { AbstractPaymentProvider, PaymentSessionStatus } from "@medusajs/framework/utils";

interface AurpayOptions {
  api_key: string;
  environment?: string;
  callback_url?: string;
  succeed_url?: string;
  timeout_url?: string;
}

class AurpayPaymentService extends AbstractPaymentProvider<AurpayOptions> {
  static identifier = "aurpay";

  protected logger_: any;
  protected options_: AurpayOptions;

  private readonly BASE_URL = "https://dashboard.aurpay.net";

  constructor(container: any, options: AurpayOptions) {
    super(container, options);
    this.options_ = options;
    this.logger_ = container.logger;

    if (!options.api_key) {
      this.logger_.warn("Aurpay: AURPAY_API_KEY no está configurada.");
    }
  }

  // ─── Método principal: crear sesión de pago ───────────────────────────────
  async initiatePayment(input: any): Promise<any> {
    try {
      const { amount, currency_code } = input;

      // Aurpay recibe el monto en la moneda fiat (ej: USD)
      // Medusa guarda los montos en centavos, hay que convertir
      const price = amount / 100;
      const currency = (currency_code || "USD").toUpperCase();

      const payload = {
        price,
        currency,
        succeed_url: this.options_.succeed_url || "",
        timeout_url: this.options_.timeout_url || "",
        callback_url: this.options_.callback_url || "",
        enable_post_callback: true, // Usamos POST para recibir datos del pedido
      };

      const response = await this.callAurpayAPI("POST", "/api/order/pay-url", payload);

      if (!response.result || !response.data?.pay_url) {
        throw new Error(`Aurpay no devolvió pay_url: ${JSON.stringify(response)}`);
      }

      this.logger_.info(`Aurpay: orden creada. pay_url=${response.data.pay_url}`);

      return {
        id: response.data.pay_url, // Usamos pay_url como identificador de sesión
        pay_url: response.data.pay_url,
        status: "pending",
        data: response.data,
      };
    } catch (error) {
      this.logger_.error(`Aurpay initiatePayment error: ${error}`);
      throw error;
    }
  }

  // ─── Aurpay no soporta capture manual, se captura automáticamente ─────────
  async authorizePayment(input: any): Promise<any> {
    const { data } = input;
    return {
      status: PaymentSessionStatus.AUTHORIZED,
      data: data || {},
    };
  }

  async capturePayment(input: any): Promise<any> {
    // Aurpay captura automáticamente al confirmar el pago cripto
    return {
      status: "captured",
      data: input.data || {},
    };
  }

  // ─── Consultar estado de una orden ───────────────────────────────────────
  async retrievePayment(input: any): Promise<any> {
    try {
      const orderId = input?.data?.order_id || input?.session_id;

      if (!orderId) {
        return { status: "pending", data: input?.data || {} };
      }

      const response = await this.callAurpayAPI(
        "GET",
        `/api/v2/order/detail/${orderId}`
      );

      return {
        status: this.mapAurpayStatus(response.data?.status),
        data: response.data || {},
      };
    } catch (error) {
      this.logger_.error(`Aurpay retrievePayment error: ${error}`);
      return { status: "pending", data: {} };
    }
  }

  async getPaymentStatus(input: any): Promise<any> {
    try {
      const orderId = input?.data?.order_id;

      if (!orderId) {
        return { status: PaymentSessionStatus.PENDING };
      }

      const response = await this.callAurpayAPI(
        "GET",
        `/api/v2/order/detail/${orderId}`
      );

      return {
        status: this.mapAurpayStatus(response.data?.status),
      };
    } catch (error) {
      this.logger_.error(`Aurpay getPaymentStatus error: ${error}`);
      return { status: PaymentSessionStatus.ERROR };
    }
  }

  // ─── Refund ───────────────────────────────────────────────────────────────
  async refundPayment(input: any): Promise<any> {
    try {
      const orderId = input?.data?.order_id;

      if (!orderId) {
        throw new Error("Aurpay refund: no se encontró order_id");
      }

      const response = await this.callAurpayAPI(
        "POST",
        `/api/v2/order/refund/${orderId}`
      );

      return {
        status: "refunded",
        data: response.data || {},
      };
    } catch (error) {
      this.logger_.error(`Aurpay refundPayment error: ${error}`);
      throw error;
    }
  }

  // ─── Cancel / Delete ──────────────────────────────────────────────────────
  async cancelPayment(input: any): Promise<any> {
    // Aurpay no tiene endpoint de cancelación manual,
    // las órdenes expiran solas (OVERDUE)
    this.logger_.info("Aurpay: cancelPayment llamado (no hay endpoint de cancel en Aurpay)");
    return { status: "canceled", data: input?.data || {} };
  }

  async deletePayment(input: any): Promise<any> {
    return this.cancelPayment(input);
  }

  async updatePayment(input: any): Promise<any> {
    // Si cambia el monto, creamos una nueva sesión
    return this.initiatePayment(input);
  }

  // ─── Webhook ──────────────────────────────────────────────────────────────
  async getWebhookActionAndData(input: any): Promise<any> {
    try {
      const { body, headers } = input;

      // Verificación básica por Callback-Token si está configurado
      const callbackToken = headers?.["callback-token"];
      if (callbackToken) {
        this.logger_.info(`Aurpay webhook recibido. Token: ${callbackToken}`);
      }

      const status = body?.status;
      const orderId = body?.order_id;

      this.logger_.info(`Aurpay webhook: order_id=${orderId}, status=${status}`);

      let action = "not_actionable";

      if (status === "SUCCESS" || status === "RESOLVED") {
        action = "authorized";
      } else if (status === "REFUNDED") {
        action = "refunded";
      } else if (status === "OVERDUE" || status === "TERMINATED") {
        action = "canceled";
      }

      return {
        action,
        data: {
          session_id: orderId,
          amount: body?.vs_price ? Math.round(parseFloat(body.vs_price) * 100) : 0,
          ...body,
        },
      };
    } catch (error) {
      this.logger_.error(`Aurpay getWebhookActionAndData error: ${error}`);
      return { action: "not_actionable", data: null };
    }
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  // Mapea estados de Aurpay a estados de Medusa
  private mapAurpayStatus(aurpayStatus: string): PaymentSessionStatus {
    switch (aurpayStatus) {
      case "SUCCESS":
      case "RESOLVED":
        return PaymentSessionStatus.AUTHORIZED;
      case "PENDING":
      case "PARTIAL":
        return PaymentSessionStatus.PENDING;
      case "OVERDUE":
      case "TERMINATED":
      case "FAILED":
        return PaymentSessionStatus.CANCELED;
      case "REFUNDED":
        return PaymentSessionStatus.CANCELED;
      default:
        return PaymentSessionStatus.PENDING;
    }
  }

  private async callAurpayAPI(
    method: string,
    endpoint: string,
    payload?: Record<string, any>
  ): Promise<any> {
    const url = `${this.BASE_URL}${endpoint}`;

    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        // ✅ Aurpay usa "API-Key" como header, no "Authorization: Bearer"
        "API-Key": this.options_.api_key,
      },
    };

    if (payload && method !== "GET") {
      options.body = JSON.stringify(payload);
    }

    this.logger_.debug?.(`Aurpay API call: ${method} ${url}`);

    const response = await fetch(url, options);
    const json = await response.json();

    if (!response.ok || json.result === false) {
      throw new Error(
        `Aurpay API error: ${response.status} - ${json.message || JSON.stringify(json)}`
      );
    }

    return json;
  }
}

export default AurpayPaymentService;
