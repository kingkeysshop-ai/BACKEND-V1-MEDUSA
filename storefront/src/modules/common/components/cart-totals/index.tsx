"use client"

import { convertToLocale } from "@lib/util/money"
import React from "react"

type CartTotalsProps = {
  totals: {
    total?: number | null
    subtotal?: number | null
    tax_total?: number | null
    currency_code: string
    item_subtotal?: number | null
    shipping_subtotal?: number | null
    discount_subtotal?: number | null
  }
}

const CartTotals: React.FC<CartTotalsProps> = ({ totals }) => {
  const { currency_code, total, tax_total, item_subtotal, shipping_subtotal, discount_subtotal } = totals

  return (
    <div className="flex flex-col gap-y-3 text-sm">
      <div className="flex items-center justify-between">
        <span className="text-gray-300">Subtotal (sin envío e impuestos)</span>
        <span className="text-white font-semibold" data-testid="cart-subtotal" data-value={item_subtotal || 0}>
          {convertToLocale({ amount: item_subtotal ?? 0, currency_code })}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-gray-300">Envío</span>
        <span className="text-white font-semibold" data-testid="cart-shipping" data-value={shipping_subtotal || 0}>
          {convertToLocale({ amount: shipping_subtotal ?? 0, currency_code })}
        </span>
      </div>
      {!!discount_subtotal && (
        <div className="flex items-center justify-between">
          <span className="text-yellow-400">Descuento</span>
          <span className="text-yellow-400 font-semibold" data-testid="cart-discount" data-value={discount_subtotal || 0}>
            - {convertToLocale({ amount: discount_subtotal ?? 0, currency_code })}
          </span>
        </div>
      )}
      <div className="flex items-center justify-between">
        <span className="text-gray-300">Impuestos</span>
        <span className="text-white font-semibold" data-testid="cart-taxes" data-value={tax_total || 0}>
          {convertToLocale({ amount: tax_total ?? 0, currency_code })}
        </span>
      </div>
      <div className="h-px w-full bg-gray-600 my-1" />
      <div className="flex items-center justify-between">
        <span className="text-white font-black text-base">Total</span>
        <span className="text-yellow-400 font-black text-xl" data-testid="cart-total" data-value={total || 0}>
          {convertToLocale({ amount: total ?? 0, currency_code })}
        </span>
      </div>
    </div>
  )
}

export default CartTotals
