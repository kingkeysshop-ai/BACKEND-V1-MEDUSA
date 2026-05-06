"use client"

import { updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import CartItemSelect from "@modules/cart/components/cart-item-select"
import ErrorMessage from "@modules/checkout/components/error-message"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Spinner from "@modules/common/icons/spinner"
import Thumbnail from "@modules/products/components/thumbnail"
import { useState } from "react"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview"
  currencyCode: string
}

const Item = ({ item, type = "full", currencyCode }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const changeQuantity = async (quantity: number) => {
    setError(null)
    setUpdating(true)
    await updateLineItem({ lineId: item.id, quantity })
      .catch((err) => setError(err.message))
      .finally(() => setUpdating(false))
  }

  const maxQuantity = item.variant?.manage_inventory ? 10 : 10

  if (type === "preview") {
    return (
      <div
        className="flex gap-4 p-4 border-b border-gray-700 last:border-b-0 hover:bg-gray-800/40 transition-colors duration-200"
        data-testid="product-row"
      >
        <LocalizedClientLink href={`/products/${item.product_handle}`} className="w-16 shrink-0">
          <div className="rounded-lg overflow-hidden border border-gray-700">
            <Thumbnail thumbnail={item.thumbnail} images={item.variant?.product?.images} size="square" />
          </div>
        </LocalizedClientLink>
        <div className="flex flex-1 flex-col gap-1 min-w-0">
          <LocalizedClientLink href={`/products/${item.product_handle}`}>
            <p className="text-white font-semibold text-sm hover:text-yellow-400 transition-colors truncate" data-testid="product-title">
              {item.product_title}
            </p>
          </LocalizedClientLink>
          <LineItemOptions variant={item.variant} data-testid="product-variant" />
          <span className="text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded-md w-fit mt-1">Digital</span>
        </div>
        <div className="flex flex-col items-end justify-between shrink-0 gap-2">
          <span className="text-xs text-gray-400">{item.quantity}x</span>
          <div className="text-yellow-400 font-bold text-sm">
            <LineItemPrice item={item} style="tight" currencyCode={currencyCode} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <tr
      className="border-b border-gray-700 hover:bg-gray-800/40 transition-colors duration-200"
      data-testid="product-row"
    >
      <td className="w-16 py-4 pl-6 pr-2 align-middle">
        <LocalizedClientLink href={`/products/${item.product_handle}`}>
          <div className="rounded-lg overflow-hidden border border-gray-700 w-16 h-16">
            <Thumbnail thumbnail={item.thumbnail} images={item.variant?.product?.images} size="square" />
          </div>
        </LocalizedClientLink>
      </td>
      <td className="py-4 pr-4 align-middle">
        <div className="flex flex-col gap-1 min-w-0">
          <LocalizedClientLink href={`/products/${item.product_handle}`}>
            <p className="text-white font-semibold text-sm hover:text-yellow-400 transition-colors truncate" data-testid="product-title">
              {item.product_title}
            </p>
          </LocalizedClientLink>
          <LineItemOptions variant={item.variant} data-testid="product-variant" />
          <span className="text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded-md w-fit mt-1">Digital</span>
        </div>
      </td>
      <td className="py-4 pr-4 w-24 align-middle">
        <div className="flex items-center gap-2">
          <DeleteButton id={item.id} data-testid="product-delete-button" />
          <CartItemSelect
            value={item.quantity}
            onChange={(value) => changeQuantity(parseInt(value.target.value))}
            className="w-14 h-8 bg-gray-800 border border-gray-600 text-white text-xs rounded-lg text-center"
            data-testid="product-select-button"
          >
            {Array.from({ length: Math.min(maxQuantity, 10) }, (_, i) => (
              <option value={i + 1} key={i}>{i + 1}</option>
            ))}
          </CartItemSelect>
          {updating && <Spinner />}
        </div>
        {error && <ErrorMessage error={error} data-testid="product-error-message" />}
      </td>
      <td className="hidden small:table-cell py-4 pr-4 w-20 text-right text-gray-400 text-sm align-middle">
        <LineItemUnitPrice item={item} style="tight" currencyCode={currencyCode} />
      </td>
      <td className="py-4 pr-6 w-16 text-right align-middle">
        <div className="text-yellow-400 font-bold text-sm">
          <LineItemPrice item={item} style="tight" currencyCode={currencyCode} />
        </div>
      </td>
    </tr>
  )
}

export default Item
