import LocalizedClientLink from "@modules/common/components/localized-client-link"

const EmptyCartMessage = () => {
  return (
    <div
      className="flex flex-col items-center justify-center py-32 gap-6 text-center"
      data-testid="empty-cart-message"
    >
      <span className="text-7xl">🛒</span>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-white">
          Tu carrito está <span className="text-yellow-400">vacío</span>
        </h1>
        <p className="text-gray-400 text-sm max-w-sm">
          Aún no tienes productos en tu carrito. ¡Explora nuestras licencias digitales!
        </p>
      </div>
      <LocalizedClientLink
        href="/store"
        className="px-8 py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 hover:-translate-y-0.5 transition-all duration-200"
      >
        🔑 Ver Productos
      </LocalizedClientLink>
    </div>
  )
}

export default EmptyCartMessage
