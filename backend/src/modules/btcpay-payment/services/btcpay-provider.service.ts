import { MedusaService } from "@medusajs/framework/utils"

type BTCPayOptions = {
  api_key?: string
  store_id?: string
  api_url?: string
}

class BTCPayProviderService extends MedusaService({}) {
  private options: BTCPayOptions

  constructor(container: any, options: BTCPayOptions = {}) {
    super(...arguments)
    this.options = options
  }

  async createInvoice(orderId: string, amount: number, currencyCode: string) {
    const apiUrl = this.options.api_url || process.env.BTCPAY_URL || "https://mainnet.demo.btcpayserver.org"
    const apiKey = this.options.api_key || process.env.BTCPAY_API_KEY
    const storeId = this.options.store_id || process.env.BTCPAY_STORE_ID

    if (!apiKey || !storeId) throw new Error("BTCPay credentials missing")

    const res = await fetch(`${apiUrl}/api/v1/stores/${storeId}/invoices`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "BTCPAY-API-KEY": apiKey,
      },
      body: JSON.stringify({
        price: Math.round(amount),
        currency: currencyCode?.toUpperCase() || "USD",
        orderId,
        redirectURL: `${process.env.BACKEND_PUBLIC_URL}/store/orders/${orderId}`,
      }),
    })

    if (!res.ok) throw new Error(`BTCPay Error: ${res.statusText}`)
    return await res.json()
  }

  async getInvoice(invoiceId: string) {
    const apiUrl = this.options.api_url || process.env.BTCPAY_URL || "https://mainnet.demo.btcpayserver.org"
    const apiKey = this.options.api_key || process.env.BTCPAY_API_KEY
    const storeId = this.options.store_id || process.env.BTCPAY_STORE_ID

    const res = await fetch(`${apiUrl}/api/v1/stores/${storeId}/invoices/${invoiceId}`, {
      headers: { "BTCPAY-API-KEY": apiKey! },
    })

    if (!res.ok) throw new Error(`BTCPay Error: ${res.statusText}`)
    return await res.json()
  }
}

export default BTCPayProviderService