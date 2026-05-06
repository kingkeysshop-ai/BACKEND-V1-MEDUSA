import { Metadata } from "next"
import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import CategoriesSection from "@modules/home/components/categories-section"
import WhyUs from "@modules/home/components/why-us"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "KING KEYS - Licencias Digitales Originales",
  description: "Compra licencias digitales originales de Windows, Office y más. Activación inmediata garantizada.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  const region = await getRegion(countryCode)
  const { collections } = await listCollections({ fields: "id, handle, title" })

  if (!collections || !region) return null

  return (
    <div className="min-h-screen bg-gray-950">

      {/* Hero */}
      <Hero />

      {/* Por que elegirnos */}
      <WhyUs />

      {/* Categorias */}
      <CategoriesSection />

      {/* Productos destacados */}
      <section className="py-10">
        <div className="content-container flex flex-col gap-2 mb-8">
          <span className="text-xs text-yellow-400 font-bold uppercase tracking-widest">⭐ Destacados</span>
          <h2 className="text-3xl font-black text-white">
            Productos <span className="text-yellow-400">Populares</span>
          </h2>
        </div>
        <ul className="flex flex-col gap-6">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </section>

      {/* Banner CTA */}
      <section className="content-container pb-14">
        <div className="relative bg-gradient-to-r from-gray-900 via-yellow-400/5 to-gray-900 border border-yellow-400/20 rounded-2xl p-10 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400 opacity-[0.04] blur-[80px] rounded-full pointer-events-none" />
          <div className="flex flex-col gap-2 relative z-10">
            <h2 className="text-2xl font-black text-white">
              ¿Listo para activar tu <span className="text-yellow-400">licencia?</span>
            </h2>
            <p className="text-gray-400 text-sm max-w-md">
              Entrega inmediata por email. Sin esperas, sin complicaciones.
            </p>
          </div>
          <a
            href="/store"
            className="relative z-10 px-8 py-3 bg-yellow-400 text-gray-900 font-black rounded-xl hover:bg-yellow-300 hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap text-sm"
          >
            🔑 Ver todos los productos
          </a>
        </div>
      </section>

    </div>
  )
}
