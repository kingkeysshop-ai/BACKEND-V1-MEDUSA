"use client"

import { Popover, PopoverPanel, Transition } from "@headlessui/react"

<style jsx>{`
  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  .animate-slide-in-left {
    animation: slideInLeft 0.35s ease-out forwards;
  }
  .delay-0 { animation-delay: 0ms; }
  .delay-60 { animation-delay: 60ms; }
  .delay-120 { animation-delay: 120ms; }
  .delay-180 { animation-delay: 180ms; }
`}</style>
import { ArrowRightMini, XMark } from "@medusajs/icons"
import { clx, useToggleState } from "@medusajs/ui"
import { Fragment } from "react"
import { usePathname } from "next/navigation"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import LanguageSelect from "../language-select"
import { HttpTypes } from "@medusajs/types"
import { Locale } from "@lib/data/locales"

const SideMenuItems = {
  Inicio: "/",
  Tienda: "/store",
  "Mi Cuenta": "/account",
  Carrito: "/cart",
}

type SideMenuProps = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
}

const SideMenu = ({ regions, locales, currentLocale }: SideMenuProps) => {
  const countryToggleState = useToggleState()
  const languageToggleState = useToggleState()
  const pathname = usePathname()

  return (
    <div className="h-full">
      <div className="flex items-center h-full">
        <Popover className="h-full flex">
          {({ open, close }) => (
            <>
              <div className="relative flex h-full">
                <Popover.Button
                  data-testid="nav-menu-button"
                  className="relative h-full flex items-center gap-2 text-sm text-gray-400 hover:text-yellow-400 transition-colors duration-200 focus:outline-none"
                >
                  <span className="flex flex-col gap-[5px]">
                    <span className="block w-5 h-[2px] bg-current" />
                    <span className="block w-5 h-[2px] bg-current" />
                    <span className="block w-5 h-[2px] bg-current" />
                  </span>
                  <span className="hidden small:block">Menu</span>
                </Popover.Button>
              </div>

              {open && (
                <div
                  className="fixed inset-0 z-[50] bg-black/60 backdrop-blur-sm pointer-events-auto"
                  onClick={close}
                  data-testid="side-menu-backdrop"
                />
              )}

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 -translate-x-4"
                enterTo="opacity-100 translate-x-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-x-0"
                leaveTo="opacity-0 -translate-x-4"
              >
                <PopoverPanel className="flex flex-col absolute w-full sm:w-1/3 2xl:w-1/4 sm:min-w-min h-[calc(100vh-1rem)] z-[51] inset-x-0 m-2">
                  <div
                    data-testid="nav-menu-popup"
                    className="flex flex-col h-full bg-gray-900 border border-yellow-400/20 rounded-xl justify-between p-6 shadow-2xl shadow-black"
                  >
                    {/* Header del menu */}
                    <div>
                      <div className="flex justify-between items-center mb-8">
                        <span className="text-lg font-black tracking-widest">
                          <span className="text-white">KING</span>
                          <span className="text-yellow-400"> KEYS</span>
                        </span>
                        <button
                          data-testid="close-menu-button"
                          onClick={close}
                          className="text-gray-400 hover:text-yellow-400 transition-colors"
                        >
                          <XMark />
                        </button>
                      </div>

                      {/* Links de navegacion */}
                      <ul className="flex flex-col gap-2">
                        {Object.entries(SideMenuItems).map(([name, href], index) => {
                          const delays = ['delay-0', 'delay-60', 'delay-120', 'delay-180']
                          return (
                            <li key={name} className={`animate-slide-in-left ${delays[index] || delays[0]}`}>
                              <LocalizedClientLink
                                href={href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-base font-medium ${pathname === href || (href !== "/" && pathname.includes(href)) ? "text-yellow-400 bg-yellow-400/10 border-l-2 border-yellow-400 pl-[14px]" : "text-gray-300 hover:text-yellow-400 hover:bg-yellow-400/10"}`}
                                onClick={close}
                                data-testid={`${name.toLowerCase()}-link`}
                              >
                                {name === "Inicio" && "🏠"}
                                {name === "Tienda" && "🛒"}
                                {name === "Mi Cuenta" && "👤"}
                                {name === "Carrito" && "🛍️"}
                                {name}
                              </LocalizedClientLink>
                            </li>
                          )
                        })}
                      </ul>
                    </div>

                    {/* Footer del menu */}
                    <div className="flex flex-col gap-y-4 border-t border-gray-700 pt-4">
                      {!!locales?.length && (
                        <div
                          className="flex justify-between items-center text-gray-400 hover:text-yellow-400 cursor-pointer transition-colors"
                          onMouseEnter={languageToggleState.open}
                          onMouseLeave={languageToggleState.close}
                        >
                          <LanguageSelect
                            toggleState={languageToggleState}
                            locales={locales}
                            currentLocale={currentLocale}
                          />
                          <ArrowRightMini
                            className={clx(
                              "transition-transform duration-150",
                              languageToggleState.state ? "-rotate-90" : ""
                            )}
                          />
                        </div>
                      )}
                      {regions && (
                        <div
                          className="flex justify-between items-center text-gray-400 hover:text-yellow-400 cursor-pointer transition-colors"
                          onMouseEnter={countryToggleState.open}
                          onMouseLeave={countryToggleState.close}
                        >
                          <CountrySelect
                            toggleState={countryToggleState}
                            regions={regions}
                          />
                          <ArrowRightMini
                            className={clx(
                              "transition-transform duration-150",
                              countryToggleState.state ? "-rotate-90" : ""
                            )}
                          />
                        </div>
                      )}
                      <p className="text-xs text-gray-600 text-center">
                        © {new Date().getFullYear()} King Keys. All rights reserved.
                      </p>
                    </div>
                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu
