import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function Footer() {
  const { collections } = await listCollections({ fields: "*products" })
  const productCategories = await listCategories()

  return (
    <footer className="bg-gray-900 border-t border-yellow-400/20 w-full">
      <div className="content-container flex flex-col w-full py-16">

        {/* Parte superior */}
        <div className="flex flex-col gap-y-10 lg:flex-row items-start justify-between pb-12 border-b border-gray-700">

          {/* Logo y descripcion */}
          <div className="flex flex-col gap-4 max-w-xs">
            <LocalizedClientLink href="/" className="text-2xl font-black tracking-widest uppercase">
              <span className="text-white">KING</span>
              <span className="text-yellow-400"> KEYS</span>
            </LocalizedClientLink>
            <p className="text-sm text-gray-500 leading-relaxed">
              Licencias digitales originales al mejor precio. Activación inmediata y soporte 24/7.
            </p>
            {/* Badges */}
            <div className="flex gap-2 flex-wrap mt-2">
              <span className="px-3 py-1 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs rounded-full font-medium">
                ✅ 100% Original
              </span>
              <span className="px-3 py-1 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs rounded-full font-medium">
                ⚡ Entrega Inmediata
              </span>
              <span className="px-3 py-1 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs rounded-full font-medium">
                🔒 Pago Seguro
              </span>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 text-sm">

            {/* Tienda */}
            <div className="flex flex-col gap-3">
              <span className="text-white font-bold uppercase tracking-wider text-xs">
                🛒 Tienda
              </span>
              <ul className="flex flex-col gap-2">
                <li>
                  <LocalizedClientLink href="/store" className="text-gray-400 hover:text-yellow-400 transition-colors duration-200">
                    Todos los productos
                  </LocalizedClientLink>
                </li>
                {productCategories?.slice(0, 4).map((c) => !c.parent_category && (
                  <li key={c.id}>
                    <LocalizedClientLink
                      href={`/categories/${c.handle}`}
                      className="text-gray-400 hover:text-yellow-400 transition-colors duration-200"
                    >
                      {c.name}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Colecciones */}
            {collections && collections.length > 0 && (
              <div className="flex flex-col gap-3">
                <span className="text-white font-bold uppercase tracking-wider text-xs">
                  📦 Colecciones
                </span>
                <ul className="flex flex-col gap-2">
                  {collections.slice(0, 5).map((c) => (
                    <li key={c.id}>
                      <LocalizedClientLink
                        href={`/collections/${c.handle}`}
                        className="text-gray-400 hover:text-yellow-400 transition-colors duration-200"
                      >
                        {c.title}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Mi Cuenta */}
            <div className="flex flex-col gap-3">
              <span className="text-white font-bold uppercase tracking-wider text-xs">
                👤 Mi Cuenta
              </span>
              <ul className="flex flex-col gap-2">
                {[
                  { label: "Iniciar Sesión", href: "/account" },
                  { label: "Mis Pedidos", href: "/account/orders" },
                  { label: "Perfil", href: "/account/profile" },
                  { label: "Carrito", href: "/cart" },
                ].map((item) => (
                  <li key={item.href}>
                    <LocalizedClientLink
                      href={item.href}
                      className="text-gray-400 hover:text-yellow-400 transition-colors duration-200"
                    >
                      {item.label}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* Parte inferior */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 text-xs text-gray-600">
          <p>© {new Date().getFullYear()} <span className="text-yellow-400 font-bold">King Keys</span>. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <LocalizedClientLink href="/privacy" className="hover:text-yellow-400 transition-colors duration-200">Privacidad</LocalizedClientLink>
            <LocalizedClientLink href="/terms" className="hover:text-yellow-400 transition-colors duration-200">Términos</LocalizedClientLink>
            <LocalizedClientLink href="/support" className="hover:text-yellow-400 transition-colors duration-200">Soporte</LocalizedClientLink>
          </div>
        </div>

      </div>
    </footer>
  )
}
