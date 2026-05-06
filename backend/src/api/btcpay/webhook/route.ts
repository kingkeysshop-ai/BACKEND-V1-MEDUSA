import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER)
  const paymentModuleService = req.scope.resolve(Modules.PAYMENT)

  try {
    logger.info("[BTCPay Webhook] Notificación recibida")
    logger.info(`[BTCPay Webhook] Headers: ${JSON.stringify(req.headers)}`)
    logger.info(`[BTCPay Webhook] Body: ${JSON.stringify(req.body)}`)

    await (paymentModuleService as any).processWebhookPayload("pp_btcpay_btcpay", {
      data: req.body as Record<string, unknown>,
      rawData: JSON.stringify(req.body),
      headers: req.headers as Record<string, string>,
    })

    logger.info("[BTCPay Webhook] Procesado OK")
    return res.status(200).json({ received: true })
  } catch (error: any) {
    logger.error(`[BTCPay Webhook] Error procesando webhook: ${error.message}`)
    logger.error(error.stack)
    return res.status(200).json({ received: true, error: error.message })
  }
}

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  return res.status(200).json({
    status: "ok",
    message: "BTCPay webhook endpoint is alive",
    timestamp: new Date().toISOString(),
  })
}
