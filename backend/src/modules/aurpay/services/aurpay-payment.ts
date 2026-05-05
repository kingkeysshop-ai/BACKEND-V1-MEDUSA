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
  }  // ==================== MÉTODOS MEDUSA v2 ====================

  async initiatePayment(
    input: InitiatePaymentInput
  ): Promise<InitiatePaymentOutput> {
    const { amount, currency_code } = input

    // Aurpay trabaja en USD. Conversión simple desde COP.
    // TODO: reemplazar por tasa de cambio real (API)
    const priceUsd =
      currency_code.toLowerCase() === "cop"
        ? Number(amount) / 4000
        : Number(amount) / 100

    const frontendUrl = process.env.FRONTEND_URL || "https://kingkeys.net"
    const backendUrl = process.env.BACKEND_URL || "https://kingkeys.net"

    const payload = {
      price: priceUsd,
      currency: "USD",
      succeed_url: `${frontendUrl}/order/confirmed`,
      timeout_url: `${frontendUrl}/checkout`,
      callback_url: `${backendUrl}/webhooks/aurpay`,
      timeout_callback: `${backendUrl}/webhooks/aurpay`,
    }

    const result = await this.callAurpayAPI(
      "POST",
      "/api/order/pay-url",
      payload
    )

    const aurpayOrderId = result.order_id || result.data?.order_id
    const payUrl = result.pay_url || result.data?.pay_url

    return {
      id: aurpayOrderId,
      data: {
        aurpay_order_id: aurpayOrderId,
        pay_url: payUrl,
        raw: result,
      },
    }
  }

  async authorizePayment(
    input: AuthorizePaymentInput
  ): Promise<AuthorizePaymentOutput> {
    const paymentSessionData = input.data ?? {}
    const orderId = paymentSessionData.aurpay_order_id as string | undefined

    if (!orderId) {
      return {
        status: "pending",
        data: paymentSessionData,
      }
    }

    // El webhook es quien marca AUTHORIZED. Aquí devolvemos el último estado conocido.
    return {
      status: "authorized",
      data: paymentSessionData,
    }
  }

  async capturePayment(
    input: CapturePaymentInput
  ): Promise<CapturePaymentOutput> {
    // Aurpay captura automáticamente al recibir el pago on-chain.
    return {
      data: input.data ?? {},
    }
  }

  async cancelPayment(
    input: CancelPaymentInput
  ): Promise<CancelPaymentOutput> {
    return {
      data: input.data ?? {},
    }
  }

  async deletePayment(
    input: DeletePaymentInput
  ): Promise<DeletePaymentOutput> {
    return {
      data: input.data ?? {},
    }
  }

  async refundPayment(
    input: RefundPaymentInput
  ): Promise<RefundPaymentOutput> {
    // Aurpay no soporta refunds automáticos on-chain.
    // Se deben procesar manualmente desde el dashboard.
    console.warn(
      "[Aurpay] Refunds must be processed manually from Aurpay dashboard"
    )
    return {
      data: input.data ?? {},
    }
  }

  async retrievePayment(
    input: RetrievePaymentInput
  ): Promise<RetrievePaymentOutput> {
    const paymentSessionData = input.data ?? {}
    const orderId = paymentSessionData.aurpay_order_id as string | undefined

    if (!orderId) {
      return { data: paymentSessionData }
    }

    // Opcional: consultar estado en Aurpay.
    // const result = await this.callAurpayAPI("GET", `/api/order/status?order_id=${orderId}`)
    // return { data: { ...paymentSessionData, status: result.status } }

    return { data: paymentSessionData }
  }

  async updatePayment(
    input: UpdatePaymentInput
  ): Promise<UpdatePaymentOutput> {
    // Si cambia el monto, re-iniciamos el payment en Aurpay.
    const initiated = await this.initiatePayment({
      amount: input.amount,
      currency_code: input.currency_code,
      context: input.context,
      data: input.data,
    } as InitiatePaymentInput)

    return {
      data: initiated.data ?? {},
    }
  }
    async getPaymentStatus(
    input: GetPaymentStatusInput
  ): Promise<GetPaymentStatusOutput> {
    const paymentSessionData = input.data ?? {}
    const orderId = paymentSessionData.aurpay_order_id as string | undefined

    if (!orderId) {
      return {
        status: "pending",
        data: paymentSessionData,
      }
    }

    // Por defecto devolvemos PENDING. El webhook actualizará a AUTHORIZED/CAPTURED.
    return {
      status: "pending",
      data: paymentSessionData,
    }
  }

  // ==================== WEBHOOK ====================

  async getWebhookActionAndData(
    payload: ProviderWebhookPayload["payload"]
  ): Promise<WebhookActionResult> {
    try {
      const data = (payload.data ?? {}) as any

      // Verificar callback-token enviado por Aurpay en los headers.
      const headers = ((payload as any).headers ?? {}) as Record<string, string>
      const receivedToken =
        headers["callback-token"] || headers["Callback-Token"]

      if (
        this.options_.callbackToken &&
        receivedToken !== this.options_.callbackToken
      ) {
        console.error("[Aurpay Webhook] Invalid callback-token")
        return { action: "not_supported" }
      }

      // Aurpay envía estados: "succeed", "timeout", "failed"
      const status = data.status || data.pay_status
      const sessionId = data.merchant_order_id || data.order_id
      const amount = Number(data.price ?? data.amount ?? 0)

      if (status === "succeed" || status === "success") {
        return {
          action: "authorized",
          data: {
            session_id: sessionId,
            amount,
          },
        }
      }

      if (status === "timeout" || status === "failed") {
        return {
          action: "failed",
          data: {
            session_id: sessionId,
            amount,
          },
        }
      }

      return { action: "not_supported" }
    } catch (e: any) {
      console.error("[Aurpay Webhook] Error:", e.message)
      return { action: "not_supported" }
    }
  }
}

export default AurpayPaymentService
