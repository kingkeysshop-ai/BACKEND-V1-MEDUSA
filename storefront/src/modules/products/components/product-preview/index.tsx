import { listProducts } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({ product })

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group">
      <div
        data-testid="product-wrapper"
        className="bg-gray-900 border border-gray-700 hover:border-yellow-400/60 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/10 hover:-translate-y-1"
      >
        {/* Imagen */}
        <div className="relative overflow-hidden bg-gray-800">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
          />
          {/* Badge de oferta si aplica */}
          {cheapestPrice?.price_type === "sale" && (
            <span className="absolute top-3 left-3 px-2 py-1 bg-yellow-400 text-gray-900 text-xs font-black rounded-md uppercase tracking-wide z-10">
              🔥 Oferta
            </span>
          )}
          {/* Overlay con boton ver */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 py-2 bg-yellow-400 text-gray-900 text-sm font-bold rounded-lg">
              Ver Producto →
            </span>
          </div>
        </div>

        {/* Info del producto */}
        <div className="p-4 flex flex-col gap-2">
          {/* Titulo */}
          <h3
            className="text-white font-semibold text-sm leading-snug group-hover:text-yellow-400 transition-colors duration-200 line-clamp-2"
            data-testid="product-title"
          >
            {product.title}
          </h3>

          {/* Separador */}
          <div className="w-full h-px bg-gray-700" />

          {/* Precio */}
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-x-2">
              {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
            </div>
            <span className="text-xs text-gray-600 bg-gray-800 px-2 py-1 rounded-md">
              🔑 Digital
            </span>
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
