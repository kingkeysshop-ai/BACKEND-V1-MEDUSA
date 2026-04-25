import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info" className="flex flex-col gap-y-4 lg:max-w-[500px] mx-auto">
      {/* Coleccion */}
      {product.collection && (
        <LocalizedClientLink
          href={`/collections/${product.collection.handle}`}
          className="text-xs text-yellow-400/70 hover:text-yellow-400 uppercase tracking-widest font-bold transition-colors"
        >
          📦 {product.collection.title}
        </LocalizedClientLink>
      )}

      {/* Titulo */}
      <h2
        className="text-3xl font-black text-white leading-tight"
        data-testid="product-title"
      >
        {product.title}
      </h2>

      {/* Badge digital */}
      <div className="flex gap-2 flex-wrap">
        <span className="px-3 py-1 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs rounded-full font-bold">
          🔑 Licencia Digital
        </span>
        <span className="px-3 py-1 bg-green-400/10 border border-green-400/30 text-green-400 text-xs rounded-full font-bold">
          ⚡ Entrega Inmediata
        </span>
      </div>

      {/* Descripcion */}
      <p
        className="text-sm text-gray-400 leading-relaxed whitespace-pre-line"
        data-testid="product-description"
      >
        {product.description}
      </p>
    </div>
  )
}

export default ProductInfo
