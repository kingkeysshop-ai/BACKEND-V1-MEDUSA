"use client"

import { isAurpay, isCryptomus, isManual, isStripeLike } from "@lib/constants"
import { placeOrder } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { useElements, useStripe } from "@stripe/react-stripe-js"
import React, { useState } from "react"
import ErrorMessage from "../error-message"
import CryptomusPaymentButton from "./cryptomus-button"
import AurpayPaymentButton from "./aurpay-button"

type PaymentButtonProps = {
  cart: HttpTypes.StoreCart
  "data-testid": string
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  cart,
  "data-testid": dataTestId,
}) => {
  const notReady =
    !cart ||
    !cart.shipping_address ||
    !cart.billing_address ||
    !cart.email ||
    (cart.shipping_methods?.length ?? 0) < 1

  const paymentSession = cart.payment_collection?.payment_sessions?.[0]

  switch (true) {
    case isStripeLike(paymentSession?.provider_id):
      return (
        <StripePaymentButton
          notReady={notReady}
          cart={cart}
          data-testid={dataTestId}
        />
      )
    case isManual(paymentSession?.provider_id):
      return (
        <ManualTestPaymentButton notReady={notReady} data-testid={dataTestId} />
      )
    case isCryptomus(paymentSession?.provider_id):
      return (
        <CryptomusPaymentButton
          cart={cart}
          notReady={notReady}
          data-testid={dataTestId}
        />
      )
    case isAurpay(paymentSession?.provider_id):
      return (
        <AurpayPaymentButton
          cart={cart}
          notReady={notReady}
          data-testid={dataTestId}
        />
      )
    default:
      return (
        <button disabled className="w-full py-4 bg-gray-700 text-gray-500 font-black text-base rounded-xl cursor-not-allowed">
          Selecciona un metodo de pago
        </button>
      )
  }
}

const StripePaymentButton = ({
  cart,
  notReady,
  "data-testid": dataTestId,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => setErrorMessage(err.message))
      .finally(() => setSubmitting(false))
  }

  const stripe = useStripe()
  const elements = useElements()
  const card = elements?.getElement("card")

  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )

  const disabled = !stripe || !elements

  const handlePayment = async () => {
    setSubmitting(true)
    if (!stripe || !elements || !card || !cart) {
      setSubmitting(false)
      return
    }
    await stripe
      .confirmCardPayment(session?.data.client_secret as string, {
        payment_method: {
          card,
          billing_details: {
            name: cart.billing_address?.first_name + " " + cart.billing_address?.last_name,
            address: {
              city: cart.billing_address?.city ?? undefined,
              country: cart.billing_address?.country_code ?? undefined,
              line1: cart.billing_address?.address_1 ?? undefined,
              line2: cart.billing_address?.address_2 ?? undefined,
              postal_code: cart.billing_address?.postal_code ?? undefined,
              state: cart.billing_address?.province ?? undefined,
            },
            email: cart.email,
            phone: cart.billing_address?.phone ?? undefined,
          },
        },
      })
      .then(({ error, paymentIntent }) => {
        if (error) {
          const pi = error.payment_intent
          if ((pi && pi.status === "requires_capture") || (pi && pi.status === "succeeded")) {
            onPaymentCompleted()
          }
          setErrorMessage(error.message || null)
          return
        }
        if (
          (paymentIntent && paymentIntent.status === "requires_capture") ||
          paymentIntent.status === "succeeded"
        ) {
          return onPaymentCompleted()
        }
      })
  }

  return (
    <>
      <button
        disabled={disabled || notReady}
        onClick={handlePayment}
        data-testid={dataTestId}
        className="w-full py-4 bg-yellow-400 text-gray-900 font-black text-base rounded-xl hover:bg-yellow-300 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
      >
        {submitting ? (
          <span className="inline-block w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
        ) : (
          "Realizar Pedido"
        )}
      </button>
      <ErrorMessage error={errorMessage} data-testid="stripe-payment-error-message" />
    </>
  )
}

const ManualTestPaymentButton = ({
  notReady,
  "data-testid": dataTestId,
}: {
  notReady: boolean
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => setErrorMessage(err.message))
      .finally(() => setSubmitting(false))
  }

  const handlePayment = async () => {
    if (submitting) return
    setSubmitting(true)
    await onPaymentCompleted()
  }

  return (
    <>
      <button
        disabled={notReady || submitting}
        onClick={handlePayment}
        data-testid={dataTestId ?? "submit-order-button"}
        className="w-full py-4 bg-yellow-400 text-gray-900 font-black text-base rounded-xl hover:bg-yellow-300 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
      >
        {submitting ? (
          <span className="inline-block w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
        ) : (
          "Realizar Pedido"
        )}
      </button>
      <ErrorMessage error={errorMessage} data-testid="manual-payment-error-message" />
    </>
  )
}

export default PaymentButton
