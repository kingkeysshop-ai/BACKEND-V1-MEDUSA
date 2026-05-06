"use client"

import { usePathname } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const NAV_ITEMS = [
  { href: "/",        icon: "🏠", label: "Inicio"  },
  { href: "/store",   icon: "🔑", label: "Tienda"  },
  { href: "/cart",    icon: "🛒", label: "Carrito" },
  { href: "/account", icon: "👤", label: "Cuenta"  },
]

const MobileBottomNav = () => {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/" || /^\/[a-z]{2}(\/)?$/.test(pathname)
      : pathname.includes(href)

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 small:hidden bg-gray-900/95 backdrop-blur-md border-t border-yellow-400/20">
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map(({ href, icon, label }) => {
          const active = isActive(href)
          return (
            <LocalizedClientLink
              key={href}
              href={href}
              className="relative flex flex-col items-center gap-0.5 py-2 px-4 transition-colors duration-200"
            >
              {/* Linea indicadora superior */}
              <span
                className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-yellow-400 transition-all duration-300"
                style={{ width: active ? "60%" : "0%" }}
              />

              {/* Icono */}
              <span
                className="text-xl transition-transform duration-200"
                style={{ transform: active ? "scale(1.15)" : "scale(1)" }}
              >
                {icon}
              </span>

              {/* Label */}
              <span
                className="text-[10px] font-bold transition-colors duration-200"
                style={{ color: active ? "#facc15" : "#6b7280" }}
              >
                {label}
              </span>

              {/* Fondo sutil activo */}
              {active && (
                <span className="absolute inset-0 rounded-xl bg-yellow-400/10 pointer-events-none" />
              )}
            </LocalizedClientLink>
          )
        })}
      </div>
    </nav>
  )
}

export default MobileBottomNav