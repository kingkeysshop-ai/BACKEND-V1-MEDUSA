import CartTotals from "@modules/common/components/cart-totals"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OrderDetails from "@modules/order/components/order-details"
import ShippingDetails from "@modules/order/components/shipping-details"
import PaymentDetails from "@modules/order/components/payment-details"
import { HttpTypes } from "@medusajs/types"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
}

export default async function OrderCompletedTemplate({ order }: OrderCompletedTemplateProps) {
  return (
    <div className="min-h-screen bg-gray-950 py-10">
      <div className="content-container max-w-3xl mx-auto flex flex-col gap-6">

        {/* Banner exito */}
        <div className="bg-gray-900 border border-yellow-400/40 rounded-2xl p-8 flex flex-col items-center text-center gap-4">
          <div className="w-20 h-20 rounded-full bg-yellow-400/10 border-2 border-yellow-400 flex items-center justify-center text-4xl">
            👑
          </div>
          <div>
            <h1 className="text-3xl font-black text-white mb-2">Gracias por tu compra!</h1>
            <p className="text-gray-300 text-sm max-w-md">
              Tu pedido fue procesado exitosamente. Recibiras tu licencia digital en el correo electronico registrado.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap justify-center">
            {[
              { icon: "⚡", text: "Entrega Inmediata" },
              { icon: "🔒", text: "100% Seguro" },
              { icon: "✅", text: "Original Garantizado" },
            ].map((b) => (
              <span key={b.text} className="px-3 py-1 bg-yellow-400/10 border border-yellow-400/40 text-yellow-400 text-xs rounded-full font-bold">
                {b.icon} {b.text}
              </span>
            ))}
          </div>
        </div>

        {/* Detalles del pedido */}
        <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-700 bg-gray-800/60">
            <span className="text-yellow-400 text-base">👑</span>
            <h2 className="text-white font-black text-base uppercase tracking-wide">Detalles del Pedido</h2>
          </div>
          <div className="p-6 flex flex-col gap-8">

            <OrderDetails order={order} />

            {/* Productos */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-700">
                <span className="text-yellow-400 font-black text-sm uppercase tracking-wider">Productos</span>
              </div>
              <Items order={order} />
            </div>

            {/* Resumen */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-700">
                <span className="text-yellow-400 font-black text-sm uppercase tracking-wider">Resumen del Costo</span>
              </div>
              <CartTotals totals={order} />
            </div>

            {/* Envio */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-700">
                <span className="text-yellow-400 font-black text-sm uppercase tracking-wider">Envio</span>
              </div>
              <ShippingDetails order={order} />
            </div>

            {/* Pago */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-700">
                <span className="text-yellow-400 font-black text-sm uppercase tracking-wider">Pago</span>
              </div>
              <PaymentDetails order={order} />
            </div>

          </div>
        </div>

        {/* Ayuda */}
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
          <Help />
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="/account/orders"
            className="flex-1 py-3 text-center border border-yellow-400/50 text-yellow-400 font-bold rounded-xl hover:bg-yellow-400 hover:text-gray-900 transition-all duration-200 text-sm"
          >
            Ver Mis Pedidos
          </a>
          <a
            href="/store"
            className="flex-1 py-3 text-center bg-yellow-400 text-gray-900 font-bold rounded-xl hover:bg-yellow-300 transition-all duration-200 text-sm"
          >
            Seguir Comprando
          </a>
        </div>

      </div>
    </div>
  )
}
