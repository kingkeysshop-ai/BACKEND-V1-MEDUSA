"use client"

import { Radio, RadioGroup } from "@headlessui/react"
import { setShippingMethod } from "@lib/data/cart"
import { calculatePriceForShippingOption } from "@lib/data/fulfillment"
import { convertToLocale } from "@lib/util/money"
import { CheckCircleSolid, Loader } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Button, clx } from "@medusajs/ui"
import ErrorMessage from "@modules/checkout/components/error-message"
import Divider from "@modules/common/components/divider"
import MedusaRadio from "@modules/common/components/radio"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

const PICKUP_OPTION_ON = "__PICKUP_ON"
const PICKUP_OPTION_OFF = "__PICKUP_OFF"

type ShippingProps = {
  cart: HttpTypes.StoreCart
  availableShippingMethods: HttpTypes.StoreCartShippingOption[] | null
}

function formatAddress(address: HttpTypes.StoreCartAddress) {
  if (!address) return ""
  let ret = ""
  if (address.address_1) ret += ` ${address.address_1}`
  if (address.address_2) ret += `, ${address.address_2}`
  if (address.postal_code) ret += `, ${address.postal_code} ${address.city}`
  if (address.country_code) ret += `, ${address.country_code.toUpperCase()}`
  return ret
}

const Shipping: React.FC<ShippingProps> = ({ cart, availableShippingMethods }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPrices, setIsLoadingPrices] = useState(true)
  const [showPickupOptions, setShowPickupOptions] = useState<string>(PICKUP_OPTION_OFF)
  const [calculatedPricesMap, setCalculatedPricesMap] = useState<Record<string, number>>({})
  const [error, setError] = useState<string | null>(null)
  const [shippingMethodId, setShippingMethodId] = useState<string | null>(
    cart.shipping_methods?.at(-1)?.shipping_option_id || null
  )

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "delivery"

  const _pickupMethods = availableShippingMethods?.filter(
    (sm) =>
      sm.data?.["type"] === "pickup" ||
      sm.data?.["method_type"] === "pickup" ||
      sm.name?.toLowerCase().includes("pickup") ||
      sm.name?.toLowerCase().includes("recoger")
  )

  const _shippingMethods = availableShippingMethods?.filter(
    (sm) => !_pickupMethods?.some((pickup) => pickup.id === sm.id)
  )
  const hasPickupOptions = !!_pickupMethods?.length

  useEffect(() => {
    setIsLoadingPrices(true)
    if (_shippingMethods?.length) {
      const promises = _shippingMethods
        .filter((sm) => sm.price_type === "calculated")
        .map((sm) => calculatePriceForShippingOption(sm.id, cart.id))
      if (promises.length) {
        Promise.allSettled(promises).then((res) => {
          const pricesMap: Record<string, number> = {}
          res.filter((r) => r.status === "fulfilled").forEach((p) => (pricesMap[p.value?.id || ""] = p.value?.amount!))
          setCalculatedPricesMap(pricesMap)
          setIsLoadingPrices(false)
        })
      }
    }
    if (_pickupMethods?.find((m) => m.id === shippingMethodId)) {
      setShowPickupOptions(PICKUP_OPTION_ON)
    }
  }, [availableShippingMethods])

  const handleEdit = () => router.push(pathname + "?step=delivery", { scroll: false })
  const handleSubmit = () => router.push(pathname + "?step=payment", { scroll: false })

  const handleSetShippingMethod = async (id: string, variant: "shipping" | "pickup") => {
    setError(null)
    if (variant === "pickup") setShowPickupOptions(PICKUP_OPTION_ON)
    else setShowPickupOptions(PICKUP_OPTION_OFF)
    let currentId: string | null = null
    setIsLoading(true)
    setShippingMethodId((prev) => { currentId = prev; return id })
    await setShippingMethod({ cartId: cart.id, shippingMethodId: id })
      .catch((err) => { setShippingMethodId(currentId); setError(err.message) })
      .finally(() => setIsLoading(false))
  }

  useEffect(() => { setError(null) }, [isOpen])

  return (
    <div className="bg-transparent">
      <div className="flex flex-row items-center justify-between mb-6">
        <h2 className={clx("flex flex-row text-xl font-black text-white gap-x-2 items-center", {
          "opacity-50 pointer-events-none select-none": !isOpen && cart.shipping_methods?.length === 0,
        })}>
          Método de Envío
          {!isOpen && (cart.shipping_methods?.length ?? 0) > 0 && <CheckCircleSolid className="text-yellow-400" />}
        </h2>
        {!isOpen && cart?.shipping_address && cart?.billing_address && cart?.email && (
          <button
            onClick={handleEdit}
            className="text-yellow-400 hover:text-yellow-300 text-sm font-semibold transition-colors"
            data-testid="edit-delivery-button"
          >
            Editar
          </button>
        )}
      </div>

      {isOpen ? (
        <>
          <div className="grid">
            <div className="flex flex-col mb-4">
              <span className="font-bold text-white">Método de envío</span>
              <span className="text-gray-400 text-sm">¿Cómo quieres recibir tu pedido?</span>
            </div>
            <div data-testid="delivery-options-container">
              <div className="pb-8">
                {hasPickupOptions && (
                  <RadioGroup value={showPickupOptions} onChange={(value) => {
                    const id = _pickupMethods.find((option) => !option.insufficient_inventory)?.id
                    if (id) handleSetShippingMethod(id, "pickup")
                  }}>
                    <Radio
                      value={PICKUP_OPTION_ON}
                      data-testid="delivery-option-radio"
                      className={clx(
                        "flex items-center justify-between text-sm cursor-pointer py-3 border rounded-xl px-4 mb-2 transition-colors",
                        { "border-yellow-400 bg-yellow-400/10": showPickupOptions === PICKUP_OPTION_ON,
                          "border-gray-600 hover:border-gray-500": showPickupOptions !== PICKUP_OPTION_ON }
                      )}
                    >
                      <div className="flex items-center gap-x-4">
                        <MedusaRadio checked={showPickupOptions === PICKUP_OPTION_ON} />
                        <span className="text-white">Recoger en tienda</span>
                      </div>
                      <span className="text-gray-400">-</span>
                    </Radio>
                  </RadioGroup>
                )}
                <RadioGroup value={shippingMethodId} onChange={(v) => { if (v) handleSetShippingMethod(v, "shipping") }}>
                  {_shippingMethods?.map((option) => {
                    const isDisabled = option.price_type === "calculated" && !isLoadingPrices && typeof calculatedPricesMap[option.id] !== "number"
                    return (
                      <Radio
                        key={option.id}
                        value={option.id}
                        data-testid="delivery-option-radio"
                        disabled={isDisabled}
                        className={clx(
                          "flex items-center justify-between text-sm cursor-pointer py-3 border rounded-xl px-4 mb-2 transition-colors",
                          { "border-yellow-400 bg-yellow-400/10": option.id === shippingMethodId,
                            "border-gray-600 hover:border-gray-500": option.id !== shippingMethodId,
                            "cursor-not-allowed opacity-50": isDisabled }
                        )}
                      >
                        <div className="flex items-center gap-x-4">
                          <MedusaRadio checked={option.id === shippingMethodId} />
                          <span className="text-white">{option.name}</span>
                        </div>
                        <span className="text-yellow-400 font-bold">
                          {option.price_type === "flat" ? (
                            convertToLocale({ amount: option.amount!, currency_code: cart?.currency_code })
                          ) : calculatedPricesMap[option.id] ? (
                            convertToLocale({ amount: calculatedPricesMap[option.id], currency_code: cart?.currency_code })
                          ) : isLoadingPrices ? <Loader /> : "-"}
                        </span>
                      </Radio>
                    )
                  })}
                </RadioGroup>
              </div>
            </div>
          </div>

          {showPickupOptions === PICKUP_OPTION_ON && (
            <div className="grid">
              <div className="flex flex-col mb-4">
                <span className="font-bold text-white">Tienda</span>
                <span className="text-gray-400 text-sm">Elige una tienda cercana</span>
              </div>
              <div data-testid="delivery-options-container">
                <div className="pb-8">
                  <RadioGroup value={shippingMethodId} onChange={(v) => { if (v) handleSetShippingMethod(v, "pickup") }}>
                    {_pickupMethods?.map((option) => (
                      <Radio
                        key={option.id}
                        value={option.id}
                        disabled={option.insufficient_inventory}
                        data-testid="delivery-option-radio"
                        className={clx(
                          "flex items-center justify-between text-sm cursor-pointer py-3 border rounded-xl px-4 mb-2 transition-colors",
                          { "border-yellow-400 bg-yellow-400/10": option.id === shippingMethodId,
                            "border-gray-600 hover:border-gray-500": option.id !== shippingMethodId,
                            "cursor-not-allowed opacity-50": option.insufficient_inventory }
                        )}
                      >
                        <div className="flex items-start gap-x-4">
                          <MedusaRadio checked={option.id === shippingMethodId} />
                          <div className="flex flex-col">
                            <span className="text-white">{option.name}</span>
                            <span className="text-gray-400 text-xs">
                              {option.data?.["pickup_address"]
                                ? String(option.data["pickup_address"])
                                : "Dirección disponible al confirmar recogida"}
                            </span>
                          </div>
                        </div>
                        <span className="text-yellow-400 font-bold">
                          {convertToLocale({ amount: option.amount!, currency_code: cart?.currency_code })}
                        </span>
                      </Radio>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            </div>
          )}

          <div>
            <ErrorMessage error={error} data-testid="delivery-option-error-message" />
            <Button
              size="large"
              className="mt-4 w-full bg-yellow-400 text-gray-900 font-black hover:bg-yellow-300 border-0"
              onClick={handleSubmit}
              isLoading={isLoading}
              disabled={!cart.shipping_methods?.[0]}
              data-testid="submit-delivery-option-button"
            >
              Continuar al Pago
            </Button>
          </div>
        </>
      ) : (
        <div className="text-sm">
          {cart && (cart.shipping_methods?.length ?? 0) > 0 && (
            <div className="flex flex-col w-1/3">
              <p className="font-bold text-white mb-1">Método</p>
              <p className="text-gray-400">
                {cart.shipping_methods!.at(-1)!.name}{" "}
                {convertToLocale({ amount: cart.shipping_methods!.at(-1)!.amount!, currency_code: cart?.currency_code })}
              </p>
            </div>
          )}
        </div>
      )}
      <Divider className="mt-8" />
    </div>
  )
}

export default Shipping
