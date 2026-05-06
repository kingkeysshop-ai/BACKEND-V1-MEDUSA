import type {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER)
  const paymentModuleService = req.scope.resolve(Modules.PAYMENT)

  try {
    logger.info("[Aurpay Webhook] Notificación recibida")
    logger.info(
      `[Aurpay Webhook] Headers: ${JSON.stringify(req.headers)}`
    )
    logger.info(
      `[Aurpay Webhook] Body: ${JSON.stringify(req.body)}`
    )

    // FIX: Medusa v2 usa processWebhookPayload en lugar de processEvent
    await (paymentModuleService as any).processWebhookPayload("pp_aurpay_aurpay", {

      data: req.body as Record<string, unknown>,
      rawData: JSON.stringify(req.body),
      headers: req.headers as Record<string, string>,
    })

    logger.info("[Aurpay Webhook] Procesado OK")

    return res.status(200).json({ received: true })
  } catch (error: any) {
    logger.error(
      `[Aurpay Webhook] Error procesando webhook: ${error.message}`
    )
    logger.error(error.stack)

    // Devolver 200 igual para que Aurpay no reintente infinito
    return res.status(200).json({
      received: true,
      error: error.message,
    })
  }
}

// Endpoint GET para probar manualmente que el webhook está vivo
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  return res.status(200).json({
    status: "ok",
    message: "Aurpay webhook endpoint is alive",
    timestamp: new Date().toISOString(),
  })
}