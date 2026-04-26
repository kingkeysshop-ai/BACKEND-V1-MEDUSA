import { AbstractPaymentProvider } from "@medusajs/framework/utils"
import { MedusaError } from "@medusajs/framework/utils"

interface AurpayPaymentServiceOptions {
  api_key: string
  environment: "sandbox" | "production"
}

export default class AurpayPaymentService extends AbstractPaymentProvider<AurpayPaymentServiceOptions> {
  static identifier = "aurpay"

  protected readonly options_: AurpayPaymentServiceOptions
  private baseUrl: string

  constructor(
    injectedDependencies: Record<string, unknown>,
    options: AurpayPaymentServiceOptions
  ) {
    super(injectedDependencies as any, options)
    this.options_ = options

    if (!this.options_.api_key) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Aurpay requires api_key"
      )
    }

    this.baseUrl = this.options_.environment === "sandbox" 
      ? "https://sandbox-api.aurpay.net" 
      : "https://api.aurpay.net"
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`
    const response = await fetch(url, {
      ...options,
      headers: {
        "Authorization": `Bearer ${this.options_.api_key}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Aurpay error: ${response.status} ${error.message || response.statusText}`
      )
    }

    return response.json()
  }

  async initiatePayment(context: any): Promise<any> {
    const { cart } = context
    const amount = Math.round(cart.total / 100) // Aurpay expects smallest unit
    
    const orderData = {
      amount: amount.toString(),
      currency: cart.region.currency_code.toUpperCase(),
      callback_url: `${context.req.headers.origin}/payment/aurpay/callback`,
      description: `Order #${cart.id}`,
      // Add more fields as per Aurpay docs
    }

    const order = await this.request("/v1/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    })

    return {
      id: order.id,
      data: { order_id: order.id },
      payment_url: order.payment_url || order.invoice_url,
    }
  }

  async authorizePayment(paymentSessionData: any): Promise<any> {
    const orderId = paymentSessionData.data?.order_id
    if (!orderId) {
      throw new MedusaError(MedusaError.Types.INVALID_ARGUMENT, "Missing order_id")
    }

    const order = await this.request(`/v1/orders/${orderId}`)
    
    if (order.status === "paid" || order.status === "confirmed") {
      return { status: "authorized", data: paymentSessionData }
    } else if (order.status === "pending") {
      return { status: "pending", data: paymentSessionData }
    }

    return { status: "requires_action", data: paymentSessionData }
  }

  async capturePayment(paymentSessionData: any): Promise<any> {
    // Aurpay captures automatically on-chain confirmation
    return paymentSessionData
  }

  async cancelPayment(paymentSessionData: any): Promise<any> {
    const orderId = paymentSessionData.data?.order_id
    if (orderId) {
      try {
        await this.request(`/v1/orders/${orderId}/cancel`, { method: "POST" })
      } catch (e) {
        // Ignore cancel errors if already processed
      }
    }
    return paymentSessionData
  }

  async getPaymentStatus(paymentSessionData: any): Promise<any> {
    const orderId = paymentSessionData.data?.order_id
    if (!orderId) return "not_started"

    const order = await this.request(`/v1/orders/${orderId}`)
    return order.status || "pending"
  }

  async retrievePayment(paymentSessionData: any): Promise<any> {
    const orderId = paymentSessionData.data?.order_id
    if (!orderId) return {}

    return this.request(`/v1/orders/${orderId}`)
  }

  async deletePayment(paymentSessionData: any): Promise<any> {
    return {}
  }

  async updatePayment(context: any): Promise<any> {
    // Aurpay may not support amount updates post-creation
    return context
  }

  async getWebhookActionAndData(data: any): Promise<any> {
    // Process Aurpay webhook payload
    const { order_id, status } = data
    
    if (status === "paid" || status === "confirmed") {
      return {
        action: "CAPTURED" as const,
        order_id,
      }
    }

    return { action: "NOT_ACTIONABLE", data }
  }

  async refundPayment(input: any): Promise<any> {
    const { order_id, amount } = input
    const refundData = {
      amount: amount?.toString(),
    }

    const refund = await this.request(`/v1/orders/${order_id}/refunds`, {
      method: "POST",
      body: JSON.stringify(refundData),
    })

    return { ...input, refund_id: refund.id }
  }
}
