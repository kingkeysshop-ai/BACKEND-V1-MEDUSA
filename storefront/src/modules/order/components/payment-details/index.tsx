import { isStripeLike, paymentInfoMap } from "@lib/constants"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type PaymentDetailsProps = {
  order: HttpTypes.StoreOrder
}

const PaymentDetails = ({ order }: PaymentDetailsProps) => {
  const payment = order.payment_collections?.[0].payments?.[0]

  return (
    <div className="flex flex-wrap gap-6" data-testid="payment-details">
      {payment && (
        <>
          <div className="flex flex-col gap-1 min-w-[140px]">
            <p className="text-yellow-400 text-xs font-bold uppercase tracking-wider mb-1">Método de Pago</p>
            <p className="text-white text-sm" data-testid="payment-method">
              {paymentInfoMap[payment.provider_id]?.title ?? payment.provider_id}
            </p>
          </div>
          <div className="flex flex-col gap-1 min-w-[180px]">
            <p className="text-yellow-400 text-xs font-bold uppercase tracking-wider mb-1">Detalles</p>
            <div className="flex items-center gap-2">
              <span className="text-gray-300 text-sm" data-testid="payment-amount">
                {isStripeLike(payment.provider_id) && payment.data?.card_last4
                  ? `**** **** **** ${payment.data.card_last4}`
                  : `${convertToLocale({ amount: payment.amount, currency_code: order.currency_code })} pagado el ${new Date(payment.created_at ?? "").toLocaleDateString("es-ES")}`}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default PaymentDetails
