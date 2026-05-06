import { HttpTypes } from "@medusajs/types"

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
  showStatus?: boolean
}

const formatStatus = (str: string) => {
  const map: Record<string, string> = {
    pending: "Pendiente",
    completed: "Completado",
    cancelled: "Cancelado",
    requires_action: "Requiere Accion",
    not_fulfilled: "Sin Enviar",
    fulfilled: "Enviado",
    partially_fulfilled: "Parcialmente Enviado",
    awaiting: "Esperando",
    captured: "Pagado",
    refunded: "Reembolsado",
  }
  return map[str] ?? str.split("_").join(" ")
}

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-gray-800/50 rounded-xl p-5 flex flex-col gap-3 border border-gray-700">

        <div className="flex items-center gap-2 text-sm">
          <span className="text-yellow-400 font-bold">Email:</span>
          <span className="text-white font-semibold" data-testid="order-email">
            {order.email}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-yellow-400 font-bold">Fecha del pedido:</span>
          <span className="text-white" data-testid="order-date">
            {new Date(order.created_at).toLocaleDateString("es-ES", {
              year: "numeric", month: "long", day: "numeric"
            })}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-yellow-400 font-bold">Numero de orden:</span>
          <span className="text-yellow-400 font-black" data-testid="order-id">
            #{order.display_id}
          </span>
        </div>

        {showStatus && (
          <div className="flex flex-wrap gap-4 pt-2 border-t border-gray-700 mt-1">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-yellow-400 font-bold">Estado:</span>
              <span className="text-white" data-testid="order-status">
                {formatStatus(order.fulfillment_status)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-yellow-400 font-bold">Pago:</span>
              <span className="text-white" data-testid="order-payment-status">
                {formatStatus(order.payment_status)}
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default OrderDetails
