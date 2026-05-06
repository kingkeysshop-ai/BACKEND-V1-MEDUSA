import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"

const CheckoutSummary = ({ cart }: { cart: any }) => {
  return (
    <div className="sticky top-0 flex flex-col-reverse small:flex-col gap-y-6 py-8 small:py-0">
      <div className="w-full bg-gray-900 border border-yellow-400/20 rounded-xl p-6 flex flex-col gap-y-5">

        {/* Titulo */}
        <div className="flex items-center gap-2 pb-4 border-b border-gray-700">
          <span className="text-yellow-400 text-lg">🛒</span>
          <h2 className="text-white font-black text-lg">Tu Pedido</h2>
        </div>

        {/* Items */}
        <ItemsPreviewTemplate cart={cart} />

        {/* Divider */}
        <div className="w-full h-px bg-gray-600" />

        {/* Totales */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <CartTotals totals={cart} />
        </div>

        {/* Descuento */}
        <DiscountCode cart={cart} />

        {/* Garantias */}
        <div className="flex flex-col gap-2 pt-3 border-t border-gray-700">
          {[
            { icon: "✅", text: "Licencias 100% Originales" },
            { icon: "⚡", text: "Entrega Inmediata por Email" },
            { icon: "🔒", text: "Pago 100% Seguro" },
          ].map((g) => (
            <div key={g.text} className="flex items-center gap-2">
              <span className="text-sm">{g.icon}</span>
              <span className="text-xs text-gray-300 font-medium">{g.text}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default CheckoutSummary
