"use client"

import { Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { usePathname } from "next/navigation"
import { Fragment, useEffect, useRef, useState } from "react"

const CartDropdown = ({ cart: cartState }: { cart?: HttpTypes.StoreCart | null }) => {
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timer | undefined>(undefined)
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false)

  const open = () => setCartDropdownOpen(true)
  const close = () => setCartDropdownOpen(false)

  const totalItems = cartState?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0
  const subtotal = cartState?.subtotal ?? 0
  const itemRef = useRef<number>(totalItems || 0)

  const timedOpen = () => {
    open()
    const timer = setTimeout(close, 5000)
    setActiveTimer(timer)
  }

  const openAndCancel = () => {
    if (activeTimer) clearTimeout(activeTimer)
    open()
  }

  useEffect(() => {
    return () => { if (activeTimer) clearTimeout(activeTimer) }
  }, [activeTimer])

  const pathname = usePathname()

  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes("/cart")) {
      timedOpen()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItems, itemRef.current])

  return (
    <div className="h-full z-50" onMouseEnter={openAndCancel} onMouseLeave={close}>
      <Popover className="relative h-full">
        <PopoverButton className="h-full focus:outline-none">
          <LocalizedClientLink
            href="/cart"
            data-testid="nav-cart-link"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-yellow-400 transition-colors duration-200"
          >
            <span className="text-lg">🛒</span>
            <span className="hidden small:inline">Carrito</span>
            {totalItems > 0 && (
              <span className="w-5 h-5 rounded-full bg-yellow-400 text-gray-900 text-xs font-black flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </LocalizedClientLink>
        </PopoverButton>

        <Transition
          show={cartDropdownOpen}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-2"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-2"
        >
          <PopoverPanel
            static
            className="hidden small:flex flex-col absolute top-[calc(100%+1px)] right-0 w-[380px] bg-gray-900 border border-yellow-400/20 rounded-xl shadow-2xl shadow-black overflow-hidden"
            data-testid="nav-cart-dropdown"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
              <div className="flex items-center gap-2">
                <span>🛒</span>
                <h3 className="text-white font-black text-sm">Tu Carrito</h3>
              </div>
              {totalItems > 0 && (
                <span className="text-xs text-gray-500">{totalItems} {totalItems === 1 ? "producto" : "productos"}</span>
              )}
            </div>

            {cartState && cartState.items?.length ? (
              <>
                <div className="overflow-y-auto max-h-[320px] flex flex-col divide-y divide-gray-700/50 no-scrollbar">
                  {cartState.items
                    .sort((a, b) => ((a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1))
                    .map((item) => (
                      <div className="flex gap-3 p-4" key={item.id} data-testid="cart-item">
                        <LocalizedClientLink href={`/products/${item.product_handle}`} className="w-14 shrink-0">
                          <div className="rounded-lg overflow-hidden border border-gray-700">
                            <Thumbnail thumbnail={item.thumbnail} images={item.variant?.product?.images} size="square" />
                          </div>
                        </LocalizedClientLink>
                        <div className="flex flex-col flex-1 min-w-0 gap-1">
                          <LocalizedClientLink href={`/products/${item.product_handle}`} data-testid="product-link">
                            <p className="text-white text-xs font-semibold truncate hover:text-yellow-400 transition-colors">
                              {item.title}
                            </p>
                          </LocalizedClientLink>
                          <LineItemOptions variant={item.variant} data-testid="cart-item-variant" data-value={item.variant} />
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-gray-500" data-testid="cart-item-quantity">x{item.quantity}</span>
                            <span className="text-yellow-400 font-bold text-xs">
                              <LineItemPrice item={item} style="tight" currencyCode={cartState.currency_code} />
                            </span>
                          </div>
                          <DeleteButton id={item.id} className="mt-1 text-xs text-gray-600 hover:text-red-400 transition-colors w-fit" data-testid="cart-item-remove-button">
                            Eliminar
                          </DeleteButton>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="p-4 flex flex-col gap-3 border-t border-gray-700 bg-gray-800/50">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs">Subtotal</span>
                    <span className="text-white font-black text-sm" data-testid="cart-subtotal">
                      {convertToLocale({ amount: subtotal, currency_code: cartState.currency_code })}
                    </span>
                  </div>
                  <LocalizedClientLink href="/cart" onClick={close}>
                    <button className="w-full py-2.5 bg-yellow-400 text-gray-900 font-black text-sm rounded-lg hover:bg-yellow-300 transition-colors" data-testid="go-to-cart-button">
                      🛒 Ver Carrito
                    </button>
                  </LocalizedClientLink>
                  <LocalizedClientLink href="/checkout" onClick={close}>
                    <button className="w-full py-2.5 border border-yellow-400/40 text-yellow-400 text-xs font-bold rounded-lg hover:bg-yellow-400/10 transition-colors">
                      🔒 Ir al Checkout
                    </button>
                  </LocalizedClientLink>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <span className="text-5xl">🛒</span>
                <p className="text-gray-500 text-sm">Tu carrito está vacío</p>
                <LocalizedClientLink href="/store" onClick={close}>
                  <button className="px-5 py-2 bg-yellow-400 text-gray-900 text-xs font-bold rounded-lg hover:bg-yellow-300 transition-colors">
                    🔑 Ver Productos
                  </button>
                </LocalizedClientLink>
              </div>
            )}
          </PopoverPanel>
        </Transition>
      </Popover>
    </div>
  )
}

export default CartDropdown
