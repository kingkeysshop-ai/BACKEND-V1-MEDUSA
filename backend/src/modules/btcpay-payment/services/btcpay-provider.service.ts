import { AbstractPaymentProvider } from "@medusajs/framework/utils"
import type {
  PaymentProviderError,
  PaymentProviderSessionResponse,
  PaymentSessionStatus,
  ProviderWebhookPayload,
  WebhookActionResult,
  AuthorizePaymentInput,
  CapturePaymentInput,
  CancelPaymentInput,
  InitiatePaymentInput,
  DeletePaymentInput,
  GetPaymentStatusInput,
  RefundPaymentInput,
  RetrievePaymentInput,
  UpdatePaymentInput,
} from "@medusajs/framework/types"

class BTCPayProviderService extends AbstractPaymentProvider {
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

  async initiatePayment(input: InitiatePaymentInput): Promise<PaymentProviderSessionResponse | PaymentProviderError> {
    try {
      const { amount, currency_code, context } = input
      const orderId = context?.resource_id || `order-${Date.now()}`

      const res = await fetch(`${this.apiUrl}/api/v1/stores/${this.storeId}/invoices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `token ${this.apiKey}`,
        },
        body: JSON.stringify({
          amount: (amount / 100).toString(),
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
    } catch (e) {
      return { error: e.message, code: "btcpay_error", detail: e }
    }
  }

  async authorizePayment(input: AuthorizePaymentInput): Promise<{ status: PaymentSessionStatus; data: Record<string, unknown> } | PaymentProviderError> {
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
    } catch (e) {
      return { error: e.message, code: "btcpay_error", detail: e }
    }
  }

  async capturePayment(input: CapturePaymentInput): Promise<{ data: Record<string, unknown> } | PaymentProviderError> {
    return { data: input.data }
  }

  async cancelPayment(input: CancelPaymentInput): Promise<{ data: Record<string, unknown> } | PaymentProviderError> {
    return { data: input.data }
  }

  async refundPayment(input: RefundPaymentInput): Promise<{ data: Record<string, unknown> } | PaymentProviderError> {
    return { data: input.data }
  }

  async deletePayment(input: DeletePaymentInput): Promise<{ data: Record<string, unknown> } | PaymentProviderError> {
    return { data: input.data }
  }

  async getPaymentStatus(input: GetPaymentStatusInput): Promise<{ status: PaymentSessionStatus } | PaymentProviderError> {
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
    } catch (e) {
      return { error: e.message, code: "btcpay_error", detail: e }
    }
  }

  async retrievePayment(input: RetrievePaymentInput): Promise<Record<string, unknown> | PaymentProviderError> {
    return input.data
  }

  async updatePayment(input: UpdatePaymentInput): Promise<PaymentProviderSessionResponse | PaymentProviderError> {
    return { id: input.data?.invoiceId as string, data: input.data }
  }

  async getWebhookActionAndData(payload: ProviderWebhookPayload): Promise<WebhookActionResult> {
    return { action: "not_supported" }
  }
}

export default BTCPayProviderService