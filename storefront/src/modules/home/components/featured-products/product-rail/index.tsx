import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"

export default async function ProductRail({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: collection.id,
      fields: "*variants.calculated_price",
    },
  })

  if (!pricedProducts?.length) return null

  return (
    <div className="content-container py-10">
      {/* Header de coleccion */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="w-1 h-6 bg-yellow-400 rounded-full" />
          <h2 className="text-xl font-black text-white">{collection.title}</h2>
        </div>
        <LocalizedClientLink
          href={`/collections/${collection.handle}`}
          className="text-xs text-yellow-400 hover:text-yellow-300 font-bold border border-yellow-400/30 px-3 py-1.5 rounded-lg hover:bg-yellow-400/10 transition-all duration-200"
        >
          Ver todos →
        </LocalizedClientLink>
      </div>

      {/* Grid de productos */}
      <ul className="grid grid-cols-2 small:grid-cols-3 lg:grid-cols-4 gap-4">
        {pricedProducts.map((product) => (
          <li key={product.id}>
            <ProductPreview product={product} region={region} isFeatured />
          </li>
        ))}
      </ul>
    </div>
  )
}
