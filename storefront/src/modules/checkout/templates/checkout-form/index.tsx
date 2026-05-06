import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import { HttpTypes } from "@medusajs/types"
import Addresses from "@modules/checkout/components/addresses"
import Payment from "@modules/checkout/components/payment"
import Review from "@modules/checkout/components/review"
import Shipping from "@modules/checkout/components/shipping"

export default async function CheckoutForm({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) {
  if (!cart) return null

  const shippingMethods = await listCartShippingMethods(cart.id)
  const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? "")

  if (!shippingMethods || !paymentMethods) return null

  return (
    <div className="w-full grid grid-cols-1 gap-y-6">

      {/* Paso 1 - Direccion */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-700 bg-gray-800/50">
          <span className="w-7 h-7 rounded-full bg-yellow-400 text-gray-900 text-xs font-black flex items-center justify-center">1</span>
          <span className="text-white font-bold text-sm uppercase tracking-wider">Dirección de Entrega</span>
        </div>
        <div className="p-6">
          <Addresses cart={cart} customer={customer} />
        </div>
      </div>

      {/* Paso 2 - Envio */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-700 bg-gray-800/50">
          <span className="w-7 h-7 rounded-full bg-yellow-400 text-gray-900 text-xs font-black flex items-center justify-center">2</span>
          <span className="text-white font-bold text-sm uppercase tracking-wider">Método de Envío</span>
        </div>
        <div className="p-6">
          <Shipping cart={cart} availableShippingMethods={shippingMethods} />
        </div>
      </div>

      {/* Paso 3 - Pago */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-700 bg-gray-800/50">
          <span className="w-7 h-7 rounded-full bg-yellow-400 text-gray-900 text-xs font-black flex items-center justify-center">3</span>
          <span className="text-white font-bold text-sm uppercase tracking-wider">🔒 Método de Pago</span>
        </div>
        <div className="p-6">
          <Payment cart={cart} availablePaymentMethods={paymentMethods} />
        </div>
      </div>

      {/* Paso 4 - Revision */}
      <div className="bg-gray-900 border border-yellow-400/20 rounded-xl overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-yellow-400/20 bg-yellow-400/5">
          <span className="w-7 h-7 rounded-full bg-yellow-400 text-gray-900 text-xs font-black flex items-center justify-center">4</span>
          <span className="text-white font-bold text-sm uppercase tracking-wider">👑 Revisar y Confirmar</span>
        </div>
        <div className="p-6">
          <Review cart={cart} />
        </div>
      </div>

    </div>
  )
}
