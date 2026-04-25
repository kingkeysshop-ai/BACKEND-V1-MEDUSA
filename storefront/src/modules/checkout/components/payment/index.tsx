"use client"

import { RadioGroup } from "@headlessui/react"
import { isStripeLike, paymentInfoMap } from "@lib/constants"
import { initiatePaymentSession } from "@lib/data/cart"
import { CheckCircleSolid, CreditCard } from "@medusajs/icons"
import { Button, Container, clx } from "@medusajs/ui"
import ErrorMessage from "@modules/checkout/components/error-message"
import PaymentContainer, { StripeCardContainer } from "@modules/checkout/components/payment-container"
import Divider from "@modules/common/components/divider"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

const Payment = ({
  cart,
  availablePaymentMethods,
}: {
  cart: any
  availablePaymentMethods: any[]
}) => {
  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (paymentSession: any) => paymentSession.status === "pending"
  )

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardBrand, setCardBrand] = useState<string | null>(null)
  const [cardComplete, setCardComplete] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(activeSession?.provider_id ?? "")

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "payment"

  const setPaymentMethod = async (method: string) => {
    setError(null)
    setSelectedPaymentMethod(method)
    if (isStripeLike(method)) {
      await initiatePaymentSession(cart, { provider_id: method })
    }
  }

  const paidByGiftcard = cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0
  const paymentReady = (activeSession && cart?.shipping_methods.length !== 0) || paidByGiftcard

  const createQueryString = useCallback((name: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set(name, value)
    return params.toString()
  }, [searchParams])

  const handleEdit = () => router.push(pathname + "?" + createQueryString("step", "payment"), { scroll: false })

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const shouldInputCard = isStripeLike(selectedPaymentMethod) && !activeSession
      const checkActiveSession = activeSession?.provider_id === selectedPaymentMethod
      if (!checkActiveSession) {
        await initiatePaymentSession(cart, { provider_id: selectedPaymentMethod })
      }
      if (!shouldInputCard) {
        return router.push(pathname + "?" + createQueryString("step", "review"), { scroll: false })
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { setError(null) }, [isOpen])

  return (
    <div className="bg-transparent">
      <div className="flex flex-row items-center justify-between mb-6">
        <h2 className={clx("flex flex-row text-xl font-black text-white gap-x-2 items-center", {
          "opacity-50 pointer-events-none select-none": !isOpen && !paymentReady,
        })}>
          🔒 Método de Pago
          {!isOpen && paymentReady && <CheckCircleSolid className="text-yellow-400" />}
        </h2>
        {!isOpen && paymentReady && (
          <button
            onClick={handleEdit}
            className="text-yellow-400 hover:text-yellow-300 text-sm font-semibold transition-colors"
            data-testid="edit-payment-button"
          >
            Editar
          </button>
        )}
      </div>

      <div>
        <div className={isOpen ? "block" : "hidden"}>
          {!paidByGiftcard && availablePaymentMethods?.length && (
            <RadioGroup value={selectedPaymentMethod} onChange={(value: string) => setPaymentMethod(value)}>
              {availablePaymentMethods.map((paymentMethod) => (
                <div key={paymentMethod.id}>
                  {isStripeLike(paymentMethod.id) ? (
                    <StripeCardContainer
                      paymentProviderId={paymentMethod.id}
                      selectedPaymentOptionId={selectedPaymentMethod}
                      paymentInfoMap={paymentInfoMap}
                      setCardBrand={setCardBrand}
                      setError={setError}
                      setCardComplete={setCardComplete}
                    />
                  ) : (
                    <PaymentContainer
                      paymentInfoMap={paymentInfoMap}
                      paymentProviderId={paymentMethod.id}
                      selectedPaymentOptionId={selectedPaymentMethod}
                    />
                  )}
                </div>
              ))}
            </RadioGroup>
          )}

          {paidByGiftcard && (
            <div className="flex flex-col w-1/3">
              <p className="font-bold text-white mb-1">Método de pago</p>
              <p className="text-gray-400" data-testid="payment-method-summary">Tarjeta de regalo</p>
            </div>
          )}

          <ErrorMessage error={error} data-testid="payment-method-error-message" />

          <Button
            size="large"
            className="mt-6 w-full bg-yellow-400 text-gray-900 font-black hover:bg-yellow-300 border-0"
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={
              (isStripeLike(selectedPaymentMethod) && !cardComplete) ||
              (!selectedPaymentMethod && !paidByGiftcard)
            }
            data-testid="submit-payment-button"
          >
            {!activeSession && isStripeLike(selectedPaymentMethod)
              ? "Ingresar datos de tarjeta"
              : "Continuar a la revisión"}
          </Button>
        </div>

        <div className={isOpen ? "hidden" : "block"}>
          {cart && paymentReady && activeSession ? (
            <div className="flex items-start gap-x-1 w-full">
              <div className="flex flex-col w-1/3">
                <p className="font-bold text-white mb-1">Método de pago</p>
                <p className="text-gray-400" data-testid="payment-method-summary">
                  {paymentInfoMap[activeSession?.provider_id]?.title || activeSession?.provider_id}
                </p>
              </div>
              <div className="flex flex-col w-1/3">
                <p className="font-bold text-white mb-1">Detalles de pago</p>
                <div className="flex gap-2 text-sm text-gray-400 items-center" data-testid="payment-details-summary">
                  <Container className="flex items-center h-7 w-fit p-2 bg-gray-800">
                    {paymentInfoMap[selectedPaymentMethod]?.icon || <CreditCard />}
                  </Container>
                  <span>
                    {isStripeLike(selectedPaymentMethod) && cardBrand
                      ? cardBrand
                      : "Aparecerá el siguiente paso"}
                  </span>
                </div>
              </div>
            </div>
          ) : paidByGiftcard ? (
            <div className="flex flex-col w-1/3">
              <p className="font-bold text-white mb-1">Método de pago</p>
              <p className="text-gray-400" data-testid="payment-method-summary">Tarjeta de regalo</p>
            </div>
          ) : null}
        </div>
      </div>
      <Divider className="mt-8" />
    </div>
  )
}

export default Payment
