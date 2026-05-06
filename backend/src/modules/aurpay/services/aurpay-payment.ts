import crypto from "crypto"
import {
  AbstractPaymentProvider,
} from "@medusajs/framework/utils"
import {
  AuthorizePaymentInput,
  AuthorizePaymentOutput,
  CancelPaymentInput,
  CancelPaymentOutput,
  CapturePaymentInput,
  CapturePaymentOutput,
  DeletePaymentInput,
  DeletePaymentOutput,
  GetPaymentStatusInput,
  GetPaymentStatusOutput,
  InitiatePaymentInput,
  InitiatePaymentOutput,
  PaymentSessionStatus,
  ProviderWebhookPayload,
  RefundPaymentInput,
  RefundPaymentOutput,
  RetrievePaymentInput,
  RetrievePaymentOutput,
  UpdatePaymentInput,
  UpdatePaymentOutput,
  WebhookActionResult,
} from "@medusajs/framework/types"

type AurpayOptions = {
  apiToken: string
  apiSecret: string
  callbackToken: string
  callbackSecret: string
  baseUrl?: string
}

class AurpayPaymentService extends AbstractPaymentProvider<AurpayOptions> {
  static identifier = "aurpay"

  protected options_: AurpayOptions
  protected aurpayBaseUrl: string

  constructor(container: any, options: AurpayOptions) {
    super(container, options)
    this.options_ = options
    this.aurpayBaseUrl = options.baseUrl || "https://dashboard.aurpay.net"
  }

  // ==================== AUTH HMAC-SHA256 ====================

  private generateAuthHeaders(
    method: string,
    path: string,
    body?: string
  ): Record<string, string> {
    const algorithm = "HMAC-SHA256"
    const date = new Date().toISOString()

    let bodyMd5 = ""
    if (method.toUpperCase() !== "GET" && body) {
      bodyMd5 = crypto.createHash("md5").update(body).digest("hex")
    }

    const requestInfo = `${method.toUpperCase()} ${path}`
    const signatureOrigin = bodyMd5
      ? `${algorithm} | ${date} | ${requestInfo} | ${bodyMd5}`
      : `${algorithm} | ${date} | ${requestInfo}`

    const signature = crypto
      .createHmac("sha256", this.options_.apiSecret)
      .update(signatureOrigin)
      .digest("base64")

    return {
      "API-Token": this.options_.apiToken,
      "Algorithm": algorithm,
      "Date": date,
      "Body-MD5": bodyMd5,
      "Signature": signature,
      "Content-Type": "application/json",
    }
  }

  private async callAurpayAPI(
    method: string,
    path: string,
    body?: Record<string, any>
  ): Promise<any> {
    const bodyStr = body ? JSON.stringify(body) : undefined
    const headers = this.generateAuthHeaders(method, path, bodyStr)

    const response = await fetch(`${this.aurpayBaseUrl}${path}`, {
      method,
      headers,
      body: bodyStr,
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("[Aurpay] API error:", data)
      throw new Error(
        `Aurpay API error: ${response.status} - ${JSON.stringify(data)}`
      )
    }

    return data
  }

  // ==================== CONVERSIÓN DE MONEDA ====================

  private convertToUsd(amount: number, currencyCode: string): number {
    const normalized = currencyCode.toLowerCase()
    const amountInMajorUnit = Number(amount) / 100

    if (normalized === "usd") {
      return Number(amountInMajorUnit.toFixed(2))
    }

    if (normalized === "cop") {
      const rate = Number(process.env.COP_USD_RATE) || 4000
      const usd = amountInMajorUnit / rate
      return Number(usd.toFixed(2))
    }

    console.warn(
      `[Aurpay] Unsupported currency "${currencyCode}". Treating as USD.`
    )
    return Number(amountInMajorUnit.toFixed(2))
  }

  // ==================== MÉTODOS MEDUSA v2 ====================

  async initiatePayment(
    input: InitiatePaymentInput
  ): Promise<InitiatePaymentOutput> {
    const { amount, currency_code, context } = input

    const priceUsd = this.convertToUsd(Number(amount), currency_code)

    const frontendUrl = process.env.FRONTEND_URL || "https://kingkeys.net"
    const backendUrl = process.env.BACKEND_URL || "https://kingkeys.net"

    const merchantOrderId =
      (context as any)?.session_id ||
      (context as any)?.idempotency_key ||
      `medusa_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`

    const payload = {
      merchant_order_id: merchantOrderId,
      price: priceUsd,
      currency: "USD",
      notify_url: `${backendUrl}/aurpay/webhook`,
      redirect_url: `${frontendUrl}/checkout/confirmation`,
      cancel_url: `${frontendUrl}/checkout`,
    }

    console.log("[Aurpay] initiatePayment payload:", payload)

    try {
      const response = await this.callAurpayAPI(
        "POST",
        "/openapi/v1/payment/order",
        payload
      )

      console.log("[Aurpay] initiatePayment response:", response)

      return {
        id: response.data?.order_id || merchantOrderId,
        data: {
          order_id: response.data?.order_id,
          merchant_order_id: merchantOrderId,
          pay_url: response.data?.pay_url,
          price_usd: priceUsd,
          original_amount: amount,
          original_currency: currency_code,
          status: "pending",
        },
      }
    } catch (error: any) {
      console.error("[Aurpay] initiatePayment error:", error)
      throw new Error(`Aurpay initiatePayment failed: ${error.message}`)
    }
  }

  async authorizePayment(
    input: AuthorizePaymentInput
  ): Promise<AuthorizePaymentOutput> {
    const status = await this.getPaymentStatus(input as any)
    return {
      status: status.status,
      data: input.data,
    }
  }

  async capturePayment(
    input: CapturePaymentInput
  ): Promise<CapturePaymentOutput> {
    return { data: input.data }
  }

  async cancelPayment(
    input: CancelPaymentInput
  ): Promise<CancelPaymentOutput> {
    return { data: input.data }
  }

  async deletePayment(
    input: DeletePaymentInput
  ): Promise<DeletePaymentOutput> {
    return { data: input.data }
  }

  async refundPayment(
    input: RefundPaymentInput
  ): Promise<RefundPaymentOutput> {
    console.warn("[Aurpay] Refunds must be processed manually")
    return { data: input.data }
  }

  async retrievePayment(
    input: RetrievePaymentInput
  ): Promise<RetrievePaymentOutput> {
    const orderId = (input.data as any)?.order_id
    if (!orderId) {
      return { data: input.data }
    }

    try {
      const response = await this.callAurpayAPI(
        "GET",
        `/openapi/v1/payment/order/${orderId}`
      )
      return {
        data: { ...input.data, ...response.data },
      }
    } catch (error: any) {
      console.error("[Aurpay] retrievePayment error:", error)
      return { data: input.data }
    }
  }

  async updatePayment(
    input: UpdatePaymentInput
  ): Promise<UpdatePaymentOutput> {
    return { data: input.data }
  }

  async getPaymentStatus(
    input: GetPaymentStatusInput
  ): Promise<GetPaymentStatusOutput> {
    const orderId = (input.data as any)?.order_id
    if (!orderId) {
      return { status: "pending" as PaymentSessionStatus }
    }

    try {
      const response = await this.callAurpayAPI(
        "GET",
        `/openapi/v1/payment/order/${orderId}`
      )

      const aurpayStatus = response.data?.status?.toLowerCase()

      let status: PaymentSessionStatus = "pending"
      if (aurpayStatus === "paid" || aurpayStatus === "completed") {
        status = "captured"
      } else if (aurpayStatus === "failed" || aurpayStatus === "expired") {
        status = "error"
      } else if (aurpayStatus === "canceled") {
        status = "canceled"
      }

      return {
        status,
        data: { ...input.data, ...response.data },
      }
    } catch (error) {
      console.error("[Aurpay] getPaymentStatus error:", error)
      return { status: "pending" as PaymentSessionStatus }
    }
  }

  // ==================== WEBHOOK ====================

  async validateWebhookSignature(
    rawBody: string,
    signature: string,
    timestamp: string,
    secret: string = this.options_.callbackSecret
  ): Promise<boolean> {
    if (!signature || !timestamp) return false

    const payloadToSign = `${timestamp}${rawBody}`

    const calculatedSignature = crypto
      .createHmac("sha256", secret)
      .update(payloadToSign, "utf-8")
      .digest("hex")

    try {
      const signatureBuffer = Buffer.from(signature, "hex")
      const calculatedBuffer = Buffer.from(calculatedSignature, "hex")

      if (signatureBuffer.length !== calculatedBuffer.length) return false

      return crypto.timingSafeEqual(signatureBuffer, calculatedBuffer)
    } catch {
      return false
    }
  }

  async handleWebhookEvent(
    orderId: string,
    eventData: {
      status: string
      transactionId?: string
      rawPayload: any
    }
  ): Promise<void> {
    const { status } = eventData

    // FIX: Medusa v2 usa `container` (sin guión bajo)
    const orderService = (this.container as any).resolve("orderService")


    try {
      const order = await orderService.retrieve(orderId, {
        relations: ["payment_collections", "payment_collections.transactions"],
      })

      type AurpayMappedStatus = "pending" | "completed" | "failed" | "refunded"
      let newStatus: AurpayMappedStatus = "pending"

      if (status === "success" || status === "paid" || status === "completed") {
        newStatus = "completed"
      } else if (status === "failed" || status === "cancelled") {
        newStatus = "failed"
      } else if (status === "refunded") {
        newStatus = "refunded"
      }

      if (newStatus === "completed") {
        await orderService.update(order.id, {
          status: "completed",
          payment_collections: order.payment_collections?.map((col: any) => ({
            ...col,
            status: "authorized",
          })),
        })
      } else if (newStatus === "failed") {
        await orderService.update(order.id, { status: "pending" })
      }
    } catch (error) {
      console.error(`[Aurpay] Error al actualizar orden ${orderId}:`, error)
      throw error
    }
  }

  async getWebhookActionAndData(
    payload: ProviderWebhookPayload["payload"]
  ): Promise<WebhookActionResult> {
    const { data, headers, rawData } = payload as any

    try {
      const signature = headers?.["signature"] as string
      const date = headers?.["date"] as string

      if (signature && date) {
        const rawBody =
          typeof rawData === "string" ? rawData : JSON.stringify(data)

        const isValid = await this.validateWebhookSignature(
          rawBody,
          signature,
          date
        )

        if (!isValid) {
          console.error("[Aurpay] Webhook signature mismatch")
          return { action: "not_supported" }
        }
      }

      const callbackToken = headers?.["api-token"] as string
      if (callbackToken && callbackToken !== this.options_.callbackToken) {
        console.error("[Aurpay] Webhook token mismatch")
        return { action: "not_supported" }
      }

      const aurpayStatus = (data as any)?.status?.toLowerCase()
      const merchantOrderId = (data as any)?.merchant_order_id
      const orderId = (data as any)?.order_id
      const paidAmount = Number((data as any)?.price || 0)

      console.log("[Aurpay] Webhook received:", {
        merchantOrderId,
        orderId,
        aurpayStatus,
        paidAmount,
      })

      if (merchantOrderId) {
        await this.handleWebhookEvent(merchantOrderId, {
          status: aurpayStatus,
          transactionId: orderId,
          rawPayload: data,
        }).catch((err) =>
          console.error("[Aurpay] handleWebhookEvent error:", err)
        )
      }

      if (aurpayStatus === "paid" || aurpayStatus === "completed") {
        return {
          action: "captured",
          data: {
            session_id: merchantOrderId,
            amount: Math.round(paidAmount * 100),
          },
        }
      }

      if (aurpayStatus === "failed" || aurpayStatus === "expired") {
        return {
          action: "failed",
          data: {
            session_id: merchantOrderId,
            amount: Math.round(paidAmount * 100),
          },
        }
      }

      if (aurpayStatus === "canceled") {
        return {
          action: "canceled",
          data: {
            session_id: merchantOrderId,
            amount: Math.round(paidAmount * 100),
          },
        }
      }

      return { action: "not_supported" }
    } catch (error: any) {
      console.error("[Aurpay] Webhook error:", error)
      return { action: "not_supported" }
    }
  }
}

export default AurpayPaymentService