import {
  AbstractPaymentProvider,
  MedusaError,
  PaymentSessionStatus,
  PaymentActions,
  CreatePaymentSessionInput,
  GetPaymentStatusInput,
  GetPaymentStatusOutput,
  RefundPaymentInput,
  RefundPaymentOutput,
  WebhookActionResult,
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
   */
  async initiatePayment(
    input: CreatePaymentSessionInput
  ): Promise<{
    id: string;
    data: Record<string, unknown>;
    payment_url?: string;
  }> {
    const { amount, currency_code } = input;

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
  ): Promise<{
    status: PaymentSessionStatus;
    data: Record<string, unknown>;
  }> {
    const orderId = (paymentSessionData.data as any)?.order_id;

    if (!orderId) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Missing order_id"
      );
    }

    const order = await this.request(`/v1/orders/${orderId}`);

    if (order.status === "paid" || order.status === "confirmed") {
      return { status: PaymentSessionStatus.AUTHORIZED, data: paymentSessionData };
    } else if (order.status === "pending") {
      return { status: PaymentSessionStatus.PENDING, data: paymentSessionData };
    }

    return { status: PaymentSessionStatus.REQUIRES_MORE, data: paymentSessionData };
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
    input: GetPaymentStatusInput
  ): Promise<GetPaymentStatusOutput> {
    const orderId = (input.data as any)?.order_id;

    if (!orderId) return { status: PaymentSessionStatus.NOT_STARTED };

    const order = await this.request(`/v1/orders/${orderId}`);
    
    if (order.status === "paid" || order.status === "confirmed") {
      return { status: PaymentSessionStatus.AUTHORIZED };
    } else if (order.status === "pending") {
      return { status: PaymentSessionStatus.PENDING };
    } else if (order.status === "failed") {
      return { status: PaymentSessionStatus.CANCELED };
    }

    return { status: PaymentSessionStatus.PENDING };
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
    input: CreatePaymentSessionInput
  ): Promise<CreatePaymentSessionInput> {
    return input;
  }

  /**
   * Procesa un webhook de Aurpay y determina la acción a tomar
   */
  async getWebhookActionAndData(data: {
    data: Record<string, unknown>;
    rawData: string | Buffer;
    headers: Record<string, unknown>;
  }): Promise<WebhookActionResult> {
    const payload = data.data;
    const { order_id, status, amount } = payload;

    if (status === "paid" || status === "confirmed") {
      return {
        action: PaymentActions.CAPTURED,
        data: {
          session_id: order_id,
          amount: amount,
        },
      };
    }

    if (status === "cancelled") {
      return {
        action: PaymentActions.CANCELED,
        data: {
          session_id: order_id,
        },
      };
    }

    return {
      action: PaymentActions.NOT_ACTIONABLE,
      data,
    };
  }

  /**
   * Realiza un reembolso de un pago
   */
  async refundPayment(
    input: RefundPaymentInput
  ): Promise<RefundPaymentOutput> {
    const { payment_session_data, amount } = input;
    const orderId = (payment_session_data.data as any)?.order_id;

    if (!orderId) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Missing order_id in payment session data"
      );
    }

    const refundData: Record<string, unknown> = {};

    if (amount) {
      refundData.amount = amount.toString();
    }

    const refund = await this.request(`/v1/orders/${orderId}/refunds`, {
      method: "POST",
      body: JSON.stringify(refundData),
    });

    return { ...input, refund_id: refund.id };
  }
}