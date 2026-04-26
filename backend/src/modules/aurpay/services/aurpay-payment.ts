import {
  AbstractPaymentProvider,
  CreatePaymentSessionInput,
  PaymentSessionStatus,
  MedusaError,
} from "@medusajs/framework/utils";

interface AurpayPaymentServiceOptions {
  api_key: string;
  environment: "sandbox" | "production";
}

/**
 * Aurpay Payment Provider
 * 
 * Este servicio implementa el proveedor de pagos para Aurpay,
 * una pasarela de pagos crypto. Soporta la creación, autorización,
 * captura y cancelación de pagos.
 */
export default class AurpayPaymentService extends AbstractPaymentProvider<AurpayPaymentServiceOptions> {
  static identifier = "aurpay";

  protected readonly options_: AurpayPaymentServiceOptions;
  private baseUrl: string;

  constructor(
    injectedDependencies: Record<string, unknown>,
    options: AurpayPaymentServiceOptions
  ) {
    super(injectedDependencies as any, options);
    this.options_ = options;

    if (!this.options_.api_key) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Aurpay requires api_key"
      );
    }

    this.baseUrl =
      this.options_.environment === "sandbox"
        ? "https://sandbox-api.aurpay.net"
        : "https://api.aurpay.net";
  }

  /**
   * Realiza una solicitud a la API de Aurpay
   */
  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.options_.api_key}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Aurpay error: ${response.status} ${error.message || response.statusText}`
      );
    }

    return response.json();
  }

  /**
   * Inicia una sesión de pago creando un orden en Aurpay
   * 
   * @param context - Contiene amount, currency_code y contexto adicional
   * @returns Objeto con id, data y payment_url
   */
  async initiatePayment(
    context: CreatePaymentSessionInput
  ): Promise<{
    id: string;
    data: Record<string, unknown>;
    payment_url?: string;
  }> {
    const { amount, currency_code } = context;

    if (!amount || !currency_code) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Missing amount or currency_code in context"
      );
    }

    const orderData = {
      amount: Math.round(amount).toString(),
      currency: currency_code.toUpperCase(),
      callback_url: `${process.env.BACKEND_PUBLIC_URL}/payment/aurpay/callback`,
      description: `Medusa order`,
    };

    const order = await this.request("/v1/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });

    return {
      id: order.id,
      data: { order_id: order.id },
      payment_url: order.payment_url || order.invoice_url,
    };
  }

  /**
   * Autoriza un pago verificando el estado del orden en Aurpay
   */
  async authorizePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<{ status: PaymentSessionStatus; data: Record<string, unknown> }> {
    const orderId = (paymentSessionData.data as any)?.order_id;

    if (!orderId) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Missing order_id"
      );
    }

    const order = await this.request(`/v1/orders/${orderId}`);

    if (order.status === "paid" || order.status === "confirmed") {
      return { status: "authorized", data: paymentSessionData };
    } else if (order.status === "pending") {
      return { status: "pending", data: paymentSessionData };
    }

    return { status: "requires_action", data: paymentSessionData };
  }

  /**
   * Captura un pago autorizado
   * Aurpay captura automáticamente al confirmarse en blockchain
   */
  async capturePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    return paymentSessionData;
  }

  /**
   * Cancela un pago autorizado
   */
  async cancelPayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    const orderId = (paymentSessionData.data as any)?.order_id;

    if (orderId) {
      try {
        await this.request(`/v1/orders/${orderId}/cancel`, { method: "POST" });
      } catch (e) {
        // Ignorar errores si ya fue procesado
      }
    }

    return paymentSessionData;
  }

  /**
   * Obtiene el estado actual de un pago
   */
  async getPaymentStatus(
    paymentSessionData: Record<string, unknown>
  ): Promise<string> {
    const orderId = (paymentSessionData.data as any)?.order_id;

    if (!orderId) return "not_started";

    const order = await this.request(`/v1/orders/${orderId}`);
    return order.status || "pending";
  }

  /**
   * Recupera los detalles de un pago
   */
  async retrievePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    const orderId = (paymentSessionData.data as any)?.order_id;

    if (!orderId) return {};

    return await this.request(`/v1/orders/${orderId}`);
  }

  /**
   * Elimina un pago (no aplicable en Aurpay)
   */
  async deletePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    return {};
  }

  /**
   * Actualiza un pago (no soportado por Aurpay post-creación)
   */
  async updatePayment(
    context: CreatePaymentSessionInput
  ): Promise<CreatePaymentSessionInput> {
    return context;
  }

  /**
   * Procesa un webhook de Aurpay y determina la acción a tomar
   * 
   * @param data - Payload del webhook
   * @returns { action, data } con la acción y los datos relevantes
   */
  async getWebhookActionAndData(data: Record<string, unknown>): Promise<{
    action: "capture" | "refund" | "cancel" | "not_actionable";
    data: Record<string, unknown>;
  }> {
    const { order_id, status, amount } = data;

    if (status === "paid" || status === "confirmed") {
      return {
        action: "capture",
        data: {
          session_id: order_id,
          amount: amount,
        },
      };
    }

    if (status === "cancelled") {
      return {
        action: "cancel",
        data: {
          session_id: order_id,
        },
      };
    }

    return {
      action: "not_actionable",
      data,
    };
  }

  /**
   * Realiza un reembolso de un pago
   */
  async refundPayment(input: {
    order_id: string;
    amount?: number;
  }): Promise<Record<string, unknown>> {
    const { order_id, amount } = input;

    const refundData: Record<string, unknown> = {};

    if (amount) {
      refundData.amount = amount.toString();
    }

    const refund = await this.request(`/v1/orders/${order_id}/refunds`, {
      method: "POST",
      body: JSON.stringify(refundData),
    });

    return { ...input, refund_id: refund.id };
  }
}