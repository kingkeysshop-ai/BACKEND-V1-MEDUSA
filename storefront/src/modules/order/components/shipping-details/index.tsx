import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type ShippingDetailsProps = {
  order: HttpTypes.StoreOrder
}

const ShippingDetails = ({ order }: ShippingDetailsProps) => {
  return (
    <div className="flex flex-wrap gap-6" data-testid="shipping-details">
      <div className="flex flex-col gap-1 min-w-[140px]" data-testid="shipping-address-summary">
        <p className="text-yellow-400 text-xs font-bold uppercase tracking-wider mb-1">Dirección de Envío</p>
        <p className="text-white text-sm">{order.shipping_address?.first_name} {order.shipping_address?.last_name}</p>
        <p className="text-gray-300 text-sm">{order.shipping_address?.address_1} {order.shipping_address?.address_2}</p>
        <p className="text-gray-300 text-sm">{order.shipping_address?.postal_code}, {order.shipping_address?.city}</p>
        <p className="text-gray-300 text-sm">{order.shipping_address?.country_code?.toUpperCase()}</p>
      </div>
      <div className="flex flex-col gap-1 min-w-[140px]" data-testid="shipping-contact-summary">
        <p className="text-yellow-400 text-xs font-bold uppercase tracking-wider mb-1">Contacto</p>
        <p className="text-gray-300 text-sm">{order.shipping_address?.phone}</p>
        <p className="text-gray-300 text-sm">{order.email}</p>
      </div>
      <div className="flex flex-col gap-1 min-w-[140px]" data-testid="shipping-method-summary">
        <p className="text-yellow-400 text-xs font-bold uppercase tracking-wider mb-1">Método</p>
        <p className="text-white text-sm">
          {(order as any).shipping_methods[0]?.name} (
          {convertToLocale({ amount: order.shipping_methods?.[0].total ?? 0, currency_code: order.currency_code })})
        </p>
      </div>
    </div>
  )
}

export default ShippingDetails
