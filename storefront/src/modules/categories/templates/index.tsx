import { notFound } from "next/navigation"
import { Suspense } from "react"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

export default function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  if (!category || !countryCode) notFound()

  const parents = [] as HttpTypes.StoreProductCategory[]
  const getParents = (category: HttpTypes.StoreProductCategory) => {
    if (category.parent_category) {
      parents.push(category.parent_category)
      getParents(category.parent_category)
    }
  }
  getParents(category)

  return (
    <div className="min-h-screen bg-gray-950">

      {/* Hero de categoria */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-950 border-b border-yellow-400/20 py-10">
        <div className="content-container flex flex-col gap-3">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <LocalizedClientLink href="/" className="hover:text-yellow-400 transition-colors">
              Inicio
            </LocalizedClientLink>
            <span>›</span>
            <LocalizedClientLink href="/store" className="hover:text-yellow-400 transition-colors">
              Tienda
            </LocalizedClientLink>
            {parents.reverse().map((parent) => (
              <>
                <span key={`sep-${parent.id}`}>›</span>
                <LocalizedClientLink
                  key={parent.id}
                  href={`/categories/${parent.handle}`}
                  className="hover:text-yellow-400 transition-colors"
                >
                  {parent.name}
                </LocalizedClientLink>
              </>
            ))}
            <span>›</span>
            <span className="text-yellow-400 font-medium">{category.name}</span>
          </div>

          {/* Titulo */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-yellow-400 font-bold uppercase tracking-widest">
              📦 Categoría
            </span>
            <h1 className="text-4xl font-black text-white" data-testid="category-page-title">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-gray-400 text-sm max-w-xl">{category.description}</p>
            )}
          </div>

          {/* Subcategorias */}
          {category.category_children && category.category_children.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {category.category_children.map((c) => (
                <LocalizedClientLink
                  key={c.id}
                  href={`/categories/${c.handle}`}
                  className="px-3 py-1.5 bg-gray-800 border border-gray-700 hover:border-yellow-400/60 hover:text-yellow-400 text-gray-400 text-xs rounded-lg font-medium transition-all duration-200"
                >
                  {c.name}
                </LocalizedClientLink>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contenido */}
      <div className="flex flex-col small:flex-row small:items-start py-8 content-container gap-6" data-testid="category-container">

        {/* Filtros */}
        <div className="small:min-w-[220px] bg-gray-900 border border-gray-700 rounded-xl p-4">
          <p className="text-xs text-yellow-400 font-bold uppercase tracking-widest mb-4">🔧 Filtros</p>
          <RefinementList sortBy={sort} data-testid="sort-by-container" />
        </div>

        {/* Productos */}
        <div className="w-full">
          <Suspense fallback={<SkeletonProductGrid numberOfProducts={category.products?.length ?? 8} />}>
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              categoryId={category.id}
              countryCode={countryCode}
            />
          </Suspense>
        </div>

      </div>
    </div>
  )
}
