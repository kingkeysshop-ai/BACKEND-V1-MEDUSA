"use client"

import { clx } from "@medusajs/ui"
import { CheckCircleSolid } from "@medusajs/icons"
import PaymentButton from "../payment-button"
import { useSearchParams } from "next/navigation"

const Review = ({ cart }: { cart: any }) => {
  const searchParams = useSearchParams()
  const isOpen = searchParams.get("step") === "review"

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const previousStepsCompleted =
    cart.shipping_address &&
    cart.shipping_methods.length > 0 &&
    (cart.payment_collection || paidByGiftcard)

  return (
    <div className="bg-transparent">
      <div className="flex flex-row items-center justify-between mb-6">
        <h2 className={clx("text-xl font-black text-white flex items-center gap-2", {
          "opacity-40 pointer-events-none select-none": !isOpen,
        })}>
          Revisar y Confirmar
          {isOpen && previousStepsCompleted && (
            <CheckCircleSolid className="text-yellow-400" />
          )}
        </h2>
      </div>

      {isOpen && previousStepsCompleted && (
        <div className="flex flex-col gap-6">

          {/* Resumen de garantias */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: "✅", title: "Licencia Original", desc: "100% autentica y activable" },
              { icon: "⚡", title: "Entrega Inmediata", desc: "Por correo electronico" },
              { icon: "🔒", title: "Pago Seguro", desc: "Transaccion cifrada" },
            ].map((g) => (
              <div key={g.title} className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 flex flex-col gap-1">
                <span className="text-xl">{g.icon}</span>
                <p className="text-white font-bold text-sm">{g.title}</p>
                <p className="text-gray-400 text-xs">{g.desc}</p>
              </div>
            ))}
          </div>

          {/* Texto legal */}
          <div className="bg-yellow-400/5 border border-yellow-400/20 rounded-xl p-4">
            <p className="text-gray-300 text-sm leading-relaxed">
              Al hacer clic en{" "}
              <span className="text-yellow-400 font-bold">Realizar Pedido</span>
              , confirmas que has leido y aceptas nuestros{" "}
              <span className="text-yellow-400 font-semibold">Terminos de Uso</span>,{" "}
              <span className="text-yellow-400 font-semibold">Terminos de Venta</span>{" "}
              y{" "}
              <span className="text-yellow-400 font-semibold">Politica de Privacidad</span>.
            </p>
          </div>

          {/* Boton */}
          <PaymentButton cart={cart} data-testid="submit-order-button" />

        </div>
      )}
    </div>
  )
}

export default Review
