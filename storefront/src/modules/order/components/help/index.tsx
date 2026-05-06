import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Help = () => {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-yellow-400 text-sm font-black uppercase tracking-wider">🎧 ¿Necesitas Ayuda?</p>
      <div className="flex flex-wrap gap-3">
        <LocalizedClientLink
          href="/support"
          className="px-4 py-2 border border-yellow-400/40 text-yellow-400 text-sm font-semibold rounded-lg hover:bg-yellow-400 hover:text-gray-900 transition-all duration-200"
        >
          📩 Contactar Soporte
        </LocalizedClientLink>
        <LocalizedClientLink
          href="/support"
          className="px-4 py-2 border border-gray-600 text-gray-300 text-sm font-semibold rounded-lg hover:border-gray-400 hover:text-white transition-all duration-200"
        >
          ↩️ Devoluciones
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default Help
