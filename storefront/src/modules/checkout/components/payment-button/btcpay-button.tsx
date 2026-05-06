"use client"

import { placeOrder } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import React, { useState } from "react"
import ErrorMessage from "../error-message"

type Props = {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}

const BTCPayPaymentButton: React.FC<Props> = ({ cart, notReady, "data-testid": dataTestId }) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const paymentSession = cart.payment_collection?.payment_sessions?.find(
    (s) => s.provider_id?.includes("btcpay") && s.status === "pending"
  )
  const checkoutUrl = paymentSession?.data?.checkoutUrl as string | undefined

  const handlePayment = async () => {
    if (submitting || notReady) return
    if (!checkoutUrl) {
      setErrorMessage(
        "No se pudo obtener el enlace de pago de BTCPay. Intenta recargar la página."
      )
      return
    }

    setSubmitting(true)
    setErrorMessage(null)

    try {
      await placeOrder()
      window.location.href = checkoutUrl
    } catch (err: any) {
      setErrorMessage(err.message || "Error al iniciar el pago con BTCPay")
      setSubmitting(false)
    }
  }

  return (
    <>
      <button
        disabled={notReady || submitting || !checkoutUrl}
        onClick={handlePayment}
        data-testid={dataTestId ?? "btcpay-payment-button"}
        className="w-full py-4 bg-yellow-400 text-gray-900 font-black text-base rounded-xl hover:bg-yellow-300 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
      >
        {submitting ? (
          <span className="inline-block w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
        ) : (
          "Pagar con BTCPay"
        )}
      </button>
      <ErrorMessage error={errorMessage} data-testid="btcpay-payment-error" />
    </>
  )
}

export default BTCPayPaymentButton
