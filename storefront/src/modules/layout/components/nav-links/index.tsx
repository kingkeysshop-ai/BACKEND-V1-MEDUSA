"use client"

import { usePathname } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const NavLinks = () => {
  const pathname = usePathname()

  const isActive = (href: string) => pathname.includes(href)

  return (
    <div className="hidden small:flex items-center gap-x-5 h-full text-sm">
      {[
        { href: "/store",   label: "Tienda"   },
        { href: "/account", label: "Mi Cuenta" },
      ].map(({ href, label }) => {
        const active = isActive(href)
        return (
          <LocalizedClientLink
            key={href}
            href={href}
            className="relative flex items-center h-full transition-colors duration-200"
            data-testid={href === "/account" ? "nav-account-link" : undefined}
          >
            <span
              className="transition-colors duration-200 font-medium"
              style={{ color: active ? "#facc15" : "#9ca3af" }}
            >
              {label}
            </span>
            {/* Linea inferior activa */}
            <span
              className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-yellow-400 transition-all duration-300 origin-center"
              style={{ transform: active ? "scaleX(1)" : "scaleX(0)" }}
            />
          </LocalizedClientLink>
        )
      })}
    </div>
  )
}

export default NavLinks