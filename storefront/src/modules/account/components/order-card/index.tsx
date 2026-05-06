import { useMemo } from "react"
import Thumbnail from "@modules/products/components/thumbnail"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type OrderCardProps = {
  order: HttpTypes.StoreOrder
}

const OrderCard = ({ order }: OrderCardProps) => {
  const numberOfLines = useMemo(() => {
    return order.items?.reduce((acc, item) => acc + item.quantity, 0) ?? 0
  }, [order])

  const numberOfProducts = useMemo(() => {
    return order.items?.length ?? 0
  }, [order])

  return (
    <div
      className="bg-gray-900 border border-gray-700 hover:border-yellow-400/40 rounded-xl overflow-hidden transition-all duration-200"
      data-testid="order-card"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700 bg-gray-800/50">
        <div className="flex items-center gap-3">
          <span className="text-yellow-400 font-black text-sm" data-testid="order-display-id">
            #{order.display_id}
          </span>
          <span className="w-1 h-1 rounded-full bg-gray-600" />
          <span className="text-gray-500 text-xs" data-testid="order-created-at">
            {new Date(order.created_at).toLocaleDateString("es-ES", {
              year: "numeric", month: "long", day: "numeric"
            })}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white font-bold text-sm" data-testid="order-amount">
            {convertToLocale({ amount: order.total, currency_code: order.currency_code })}
          </span>
          <span className="text-xs text-gray-500 bg-gray-700 px-2 py-0.5 rounded-full">
            {numberOfLines} {numberOfLines > 1 ? "items" : "item"}
          </span>
        </div>
      </div>

      {/* Thumbnails de productos */}
      <div className="p-5">
        <div className="flex gap-3 mb-4">
          {order.items?.slice(0, 3).map((i) => (
            <div key={i.id} className="flex flex-col gap-1 w-16" data-testid="order-item">
              <div className="rounded-lg overflow-hidden border border-gray-700">
                <Thumbnail thumbnail={i.thumbnail} images={[]} size="square" />
              </div>
              <span className="text-xs text-gray-500 truncate" data-testid="item-title">
                {i.title}
              </span>
            </div>
          ))}
          {numberOfProducts > 3 && (
            <div className="w-16 h-16 flex items-center justify-center bg-gray-800 rounded-lg border border-gray-700">
              <span className="text-xs text-gray-400 font-bold">+{numberOfProducts - 3}</span>
            </div>
          )}
        </div>

        {/* Boton */}
        <LocalizedClientLink href={`/account/orders/details/${order.id}`}>
          <button
            className="w-full py-2.5 border border-yellow-400/40 text-yellow-400 text-xs font-bold rounded-lg hover:bg-yellow-400 hover:text-gray-900 transition-all duration-200"
            data-testid="order-details-link"
          >
            Ver Detalles del Pedido →
          </button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default OrderCard
