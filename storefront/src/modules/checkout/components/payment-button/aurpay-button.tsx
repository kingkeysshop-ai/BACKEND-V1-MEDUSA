"use client"

import { placeOrder } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import React, { useState } from "react"
import ErrorMessage from "../error-message"

type AurpayPaymentButtonProps = {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}

const AurpayPaymentButton: React.FC<AurpayPaymentButtonProps> = ({
  cart,
  notReady,
  "data-testid": dataTestId,
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Obtener la sesión de pago de Aurpay (generada por el backend con HMAC-SHA256)
  const paymentSession = cart.payment_collection?.payment_sessions?.find(
    (s) => s.provider_id?.startsWith("pp_aurpay") && s.status === "pending"
  )
  const payUrl = paymentSession?.data?.pay_url as string | undefined

  const handlePayment = async () => {
    if (submitting || notReady) return

    if (!payUrl) {
      setErrorMessage(
        "No se pudo generar el enlace de pago de Aurpay. Intenta recargar la página."
      )
      return
    }

    setSubmitting(true)

    try {
      // 1) Crear la orden en Medusa (queda en estado pending hasta que webhook confirme)
      await placeOrder()

      // 2) Redirigir al usuario a Aurpay para completar el pago
      window.location.href = payUrl
    } catch (err: any) {
      setErrorMessage(err.message || "Error al iniciar el pago")
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={handlePayment}
        disabled={notReady || submitting || !payUrl}
        data-testid={dataTestId}
        style={{
          boxShadow:
            "0 5px 30px 2px rgb(0 0 0 / 0.06), 0 3px 15px -4px rgb(0 0 0 / 0.06)",
          cursor:
            notReady || submitting || !payUrl ? "not-allowed" : "pointer",
          height: "54px",
          paddingLeft: "20px",
          boxSizing: "border-box",
          border: "none",
          outline: "none",
          background: "#23275D",
          borderRadius: "5px",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          opacity: notReady || submitting || !payUrl ? 0.5 : 1,
          width: "100%",
          justifyContent: "center",
          maxWidth: "400px",
        }}
      >
        {submitting ? (
          <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
        ) : (
          <img
            style={{ width: "24px", height: "24px" }}
            src="https://aurpay.net/wp-content/uploads/2022/06/favicon-logo.png"
            alt="logo"
          />
        )}
        <span
          style={{
            display: "block",
            height: "54px",
            backgroundColor: "#191D48",
            padding: "12px 20px",
            boxSizing: "border-box",
            transform: "skewX(-15deg) translateX(0.875rem)",
            textAlign: "center",
            flex: 1,
          }}
        >
          <span
            style={{
              display: "block",
              color: "#FFFFFF",
              fontSize: "14px",
              marginBottom: "4px",
              transform: "skewX(8deg)",
              fontWeight: 700,
            }}
          >
            {submitting ? "Procesando..." : "Pay with Aurpay"}
          </span>
          <span
            style={{
              display: "block",
              fontSize: "10px",
              color: "#FFFFFF",
              opacity: 0.5,
              transform: "skewX(6deg)",
            }}
          >
            Secured by Aurpay
          </span>
        </span>
      </button>
      <ErrorMessage
        error={errorMessage}
        data-testid="aurpay-payment-error-message"
      />
    </div>
  )
}

export default AurpayPaymentButton