import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "./paginated-products"

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div className="min-h-screen bg-gray-950">

      {/* Hero de la tienda */}
      <div className="relative bg-gradient-to-b from-gray-900 to-gray-950 border-b border-yellow-400/20 py-12">
        <div className="content-container text-center flex flex-col items-center gap-3">
          <span className="px-3 py-1 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs rounded-full font-bold uppercase tracking-widest">
            🛒 Catálogo Completo
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Todos los <span className="text-yellow-400">Productos</span>
          </h1>
          <p className="text-gray-400 text-sm max-w-md">
            Licencias digitales originales con activación inmediata garantizada.
          </p>
        </div>
      </div>

      {/* Contenido */}
      <div
        className="flex flex-col small:flex-row small:items-start py-8 content-container gap-6"
        data-testid="category-container"
      >
        {/* Filtros */}
        <div className="small:min-w-[220px] bg-gray-900 border border-gray-700 rounded-xl p-4">
          <p className="text-xs text-yellow-400 font-bold uppercase tracking-widest mb-4">
            🔧 Filtros
          </p>
          <RefinementList sortBy={sort} />
        </div>

        {/* Grid de productos */}
        <div className="w-full flex flex-col gap-6">
          <Suspense fallback={<SkeletonProductGrid />}>
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              countryCode={countryCode}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default StoreTemplate
