import { AbstractPaymentProvider } from "@medusajs/framework/utils"
import type {
  PaymentSessionStatus,
  WebhookActionResult,
} from "@medusajs/framework/types"

class BTCPayProviderService extends AbstractPaymentProvider<Record<string, unknown>> {
  static identifier = "btcpay"

  private apiUrl: string
  private apiKey: string
  private storeId: string

  constructor(container: any, options: any = {}) {
    super(container, options)
    this.apiUrl = options.api_url || process.env.BTCPAY_URL || "https://mainnet.demo.btcpayserver.org"
    this.apiKey = options.api_key || process.env.BTCPAY_API_KEY || ""
    this.storeId = options.store_id || process.env.BTCPAY_STORE_ID || ""
  }

  async initiatePayment(input: any): Promise<any> {
    try {
      const { amount, currency_code, context } = input
      const orderId = context?.cart_id || context?.id || `order-${Date.now()}`

      const res = await fetch(`${this.apiUrl}/api/v1/stores/${this.storeId}/invoices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `token ${this.apiKey}`,
        },
        body: JSON.stringify({
          amount: (Number(amount) / 100).toString(),
          currency: currency_code?.toUpperCase() || "USD",
          metadata: { orderId },
          checkout: {
            redirectURL: `${process.env.STORE_URL || process.env.BACKEND_PUBLIC_URL}/order/confirmed/${orderId}`,
          },
        }),
      })

      if (!res.ok) throw new Error(`BTCPay Error: ${res.statusText}`)
      const invoice = await res.json()

      return {
        id: invoice.id,
        data: {
          invoiceId: invoice.id,
          checkoutUrl: invoice.checkoutLink,
          status: "pending",
        },
      }
    } catch (e: any) {
      return { error: e.message, code: "btcpay_error", detail: e }
    }
  }

  async authorizePayment(input: any): Promise<any> {
    const invoiceId = input.data?.invoiceId as string
    if (!invoiceId) return { status: "pending", data: input.data }

    try {
      const res = await fetch(`${this.apiUrl}/api/v1/stores/${this.storeId}/invoices/${invoiceId}`, {
        headers: { "Authorization": `token ${this.apiKey}` },
      })
      const invoice = await res.json()

      let status: PaymentSessionStatus = "pending"
      if (["Processing", "Settled"].includes(invoice.status)) status = "authorized"
      if (["Expired", "Invalid"].includes(invoice.status)) status = "error"

      return { status, data: { ...input.data, btcpayStatus: invoice.status } }
    } catch (e: any) {
      return { error: e.message, code: "btcpay_error", detail: e }
    }
  }

  async capturePayment(input: any): Promise<any> {
    return { data: input.data }
  }

  async cancelPayment(input: any): Promise<any> {
    return { data: input.data }
  }

  async refundPayment(input: any): Promise<any> {
    return { data: input.data }
  }

  async deletePayment(input: any): Promise<any> {
    return { data: input.data }
  }

  async getPaymentStatus(input: any): Promise<{ status: PaymentSessionStatus }> {
    const invoiceId = input.data?.invoiceId as string
    if (!invoiceId) return { status: "pending" }

    try {
      const res = await fetch(`${this.apiUrl}/api/v1/stores/${this.storeId}/invoices/${invoiceId}`, {
        headers: { "Authorization": `token ${this.apiKey}` },
      })
      const invoice = await res.json()

      let status: PaymentSessionStatus = "pending"
      if (["Processing", "Settled"].includes(invoice.status)) status = "authorized"
      if (["Expired", "Invalid"].includes(invoice.status)) status = "error"

      return { status }
    } catch {
      return { status: "error" }
    }
  }

  async retrievePayment(input: any): Promise<any> {
    return input.data
  }

  async updatePayment(input: any): Promise<any> {
    return { id: input.data?.invoiceId, data: input.data }
  }

  async getWebhookActionAndData(data: { data: Record<string, unknown>; rawData: string | Buffer; headers: Record<string, unknown> }): Promise<WebhookActionResult> {
    return { action: "not_supported" }
  }
}

export default BTCPayProviderService