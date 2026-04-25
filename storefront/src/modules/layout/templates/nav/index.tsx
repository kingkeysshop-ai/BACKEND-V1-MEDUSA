import { Suspense } from "react"
import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import MobileBottomNav from "@modules/layout/components/mobile-bottom-nav"
import NavLinks from "@modules/layout/components/nav-links"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <>
      {/* Navbar desktop/mobile top */}
      <div className="sticky top-0 inset-x-0 z-50">
        <header className="relative h-16 mx-auto border-b border-yellow-400/20 bg-gray-900/95 backdrop-blur-md">
          <nav className="content-container flex items-center justify-between w-full h-full">

            {/* Izquierda - Menu hamburguesa */}
            <div className="flex-1 basis-0 h-full flex items-center">
              <SideMenu regions={regions} locales={locales} currentLocale={currentLocale} />
            </div>

            {/* Centro - Logo */}
            <LocalizedClientLink
              href="/"
              className="text-xl font-black tracking-widest uppercase hover:opacity-80 transition-opacity duration-200"
              data-testid="nav-store-link"
            >
              <span className="text-white">KING</span>
              <span className="text-yellow-400"> KEYS</span>
            </LocalizedClientLink>

            {/* Derecha */}
            <div className="flex items-center gap-x-5 h-full flex-1 basis-0 justify-end">
              <NavLinks />
              <Suspense
                fallback={
                  <LocalizedClientLink
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-yellow-400 transition-colors"
                    href="/cart"
                    data-testid="nav-cart-link"
                  >
                    <span>🛒</span>
                    <span className="hidden small:inline">Carrito</span>
                  </LocalizedClientLink>
                }
              >
                <CartButton />
              </Suspense>
            </div>

          </nav>
        </header>
      </div>

      <MobileBottomNav />

      {/* Espaciado inferior movil */}
      <div className="h-16 small:hidden" />
    </>
  )
}
