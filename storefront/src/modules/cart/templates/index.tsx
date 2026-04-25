import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import SignInPrompt from "../components/sign-in-prompt"
import { HttpTypes } from "@medusajs/types"

const CartTemplate = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  return (
    <div className="min-h-screen bg-gray-950">

      {/* Header */}
      <div className="border-b border-yellow-400/20 bg-gray-900">
        <div className="content-container py-8 flex flex-col gap-2">
          <span className="text-xs text-yellow-400 font-bold uppercase tracking-widest">🛒 King Keys</span>
          <h1 className="text-3xl font-black text-white">Tu <span className="text-yellow-400">Carrito</span></h1>
        </div>
      </div>

      <div className="content-container py-8" data-testid="cart-container">
        {cart?.items?.length ? (
          <div className="grid grid-cols-1 small:grid-cols-[1fr_380px] gap-8">

            {/* Items */}
            <div className="flex flex-col gap-y-4">
              {!customer && (
                <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">👤</span>
                    <div>
                      <p className="text-white text-sm font-bold">¿Ya tienes cuenta?</p>
                      <p className="text-gray-400 text-xs">Inicia sesión para ver tus pedidos anteriores</p>
                    </div>
                  </div>
                  <SignInPrompt />
                </div>
              )}
              <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
                <ItemsTemplate cart={cart} />
              </div>
            </div>

            {/* Resumen */}
            <div className="relative">
              <div className="sticky top-20 flex flex-col gap-4">
                <div className="bg-gray-900 border border-yellow-400/20 rounded-xl p-6">
                  <Summary cart={cart as any} />
                </div>
                {/* Garantias */}
                <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 flex flex-col gap-3">
                  {[
                    { icon: "✅", text: "Licencias 100% Originales" },
                    { icon: "⚡", text: "Entrega Inmediata por Email" },
                    { icon: "🔒", text: "Pago 100% Seguro" },
                    { icon: "🎧", text: "Soporte 24/7" },
                  ].map((g) => (
                    <div key={g.text} className="flex items-center gap-3">
                      <span>{g.icon}</span>
                      <span className="text-gray-400 text-xs">{g.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        ) : (
          <EmptyCartMessage />
        )}
      </div>
    </div>
  )
}

export default CartTemplate
