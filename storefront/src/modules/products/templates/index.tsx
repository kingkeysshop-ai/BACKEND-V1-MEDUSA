import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import ProductActionsWrapper from "./product-actions-wrapper"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  images,
}) => {
  if (!product || !product.id) return notFound()

  return (
    <div className="min-h-screen bg-gray-950">

      {/* Breadcrumb */}
      <div className="border-b border-gray-800 bg-gray-900">
        <div className="content-container py-3 flex items-center gap-2 text-xs text-gray-500">
          <a href="/" className="hover:text-yellow-400 transition-colors">Inicio</a>
          <span>›</span>
          <a href="/store" className="hover:text-yellow-400 transition-colors">Tienda</a>
          <span>›</span>
          <span className="text-yellow-400 font-medium">{product.title}</span>
        </div>
      </div>

      {/* Contenido principal */}
      <div
        className="content-container flex flex-col small:flex-row small:items-start py-8 gap-8 relative"
        data-testid="product-container"
      >
        {/* Izquierda - Info */}
        <div className="flex flex-col small:sticky small:top-20 small:max-w-[300px] w-full gap-y-6">
          <ProductInfo product={product} />
          <div className="border border-gray-700 rounded-xl overflow-hidden">
            <ProductTabs product={product} />
          </div>
        </div>

        {/* Centro - Galeria */}
        <div className="block w-full rounded-xl overflow-hidden">
          <ImageGallery images={images} />
        </div>

        {/* Derecha - Acciones */}
        <div className="flex flex-col small:sticky small:top-20 small:max-w-[300px] w-full gap-y-6">

          {/* Box de compra */}
          <div className="bg-gray-900 border border-yellow-400/20 rounded-xl p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-700">
              <span className="text-yellow-400 text-lg">👑</span>
              <span className="text-white font-bold text-sm">Compra Segura</span>
            </div>
            <ProductOnboardingCta />
            <Suspense
              fallback={
                <ProductActions disabled={true} product={product} region={region} />
              }
            >
              <ProductActionsWrapper id={product.id} region={region} />
            </Suspense>
          </div>

          {/* Garantias */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 flex flex-col gap-3">
            {[
              { icon: "✅", text: "Licencia 100% Original" },
              { icon: "⚡", text: "Activación Inmediata" },
              { icon: "🔒", text: "Pago Seguro" },
              { icon: "🎧", text: "Soporte 24/7" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <span className="text-base">{item.icon}</span>
                <span className="text-gray-400 text-xs">{item.text}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Productos relacionados */}
      <div className="border-t border-gray-800 bg-gray-900/50">
        <div className="content-container py-12">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-yellow-400 text-xl">🔑</span>
            <h2 className="text-2xl font-black text-white">Productos <span className="text-yellow-400">Relacionados</span></h2>
          </div>
          <Suspense fallback={<SkeletonRelatedProducts />}>
            <RelatedProducts product={product} countryCode={countryCode} />
          </Suspense>
        </div>
      </div>

    </div>
  )
}

export default ProductTemplate
