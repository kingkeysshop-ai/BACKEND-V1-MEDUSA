import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full bg-gray-950 relative min-h-screen">

      {/* Navbar del checkout */}
      <div className="h-16 bg-gray-900 border-b border-yellow-400/20">
        <nav className="flex h-full items-center content-container justify-between">

          {/* Volver al carrito */}
          <LocalizedClientLink
            href="/cart"
            className="flex items-center gap-x-2 text-gray-400 hover:text-yellow-400 transition-colors duration-200 flex-1 basis-0 text-sm"
            data-testid="back-to-cart-link"
          >
            <ChevronDown className="rotate-90" size={16} />
            <span className="hidden small:block">Volver al carrito</span>
            <span className="block small:hidden">Volver</span>
          </LocalizedClientLink>

          {/* Logo */}
          <LocalizedClientLink
            href="/"
            className="text-xl font-black tracking-widest uppercase"
            data-testid="store-link"
          >
            <span className="text-white">KING</span>
            <span className="text-yellow-400"> KEYS</span>
          </LocalizedClientLink>

          {/* Seguridad */}
          <div className="flex-1 basis-0 flex justify-end">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              🔒 Pago Seguro
            </span>
          </div>

        </nav>
      </div>

      {/* Contenido */}
      <div className="relative" data-testid="checkout-container">
        {children}
      </div>

      {/* Footer minimo */}
      <div className="py-6 w-full flex items-center justify-center border-t border-gray-800">
        <span className="text-xs text-gray-600">
          © {new Date().getFullYear()} <span className="text-yellow-400 font-bold">King Keys</span> · Todos los derechos reservados
        </span>
      </div>

    </div>
  )
}
