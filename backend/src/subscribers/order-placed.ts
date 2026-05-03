import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { assignLicenseWorkflow } from "../workflows/assign-license"

type OrderItem = {
  id: string
  variant_id: string | null
  quantity: number
  product_title: string
}

type Order = {
  id: string
  email: string
  customer_id: string
  items: OrderItem[]
}

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const orderId = data.id
  logger.info(`Orden recibida: ${orderId}`)

  try {
    const { data: rawOrders } = await query.graph({
      entity: "order",
      filters: { id: orderId },
      fields: [
        "id",
        "email",
        "customer_id",
        "items.id",
        "items.variant_id",
        "items.quantity",
        "items.product_title",
      ],
    })

    const orders = rawOrders as unknown as Order[]
    const order: Order | undefined = orders.find((o) => o.id === orderId)

    if (!order) {
      logger.warn(`Orden ${orderId} no encontrada`)
      return
    }

    if (!order.items || order.items.length === 0) {
      logger.warn(`Orden ${orderId} no tiene items`)
      return
    }

    for (const item of order.items) {
      if (!item.variant_id) {
        logger.warn(`Item ${item.id} sin variant_id, se omite`)
        continue
      }

      await assignLicenseWorkflow(container).run({
        input: {
          order_id: orderId,
          variant_id: item.variant_id,
          customer_id: order.customer_id,
          quantity: item.quantity,
        },
      })
    }

    logger.info(`Licencias asignadas para orden: ${orderId}`)
  } catch (error: any) {
    logger.error(`Error en orden ${orderId}: ${error?.message}`)
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
