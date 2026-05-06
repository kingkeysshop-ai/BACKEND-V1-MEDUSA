import { MetadataRoute } from "next"
import { listProducts } from "@lib/data/products"
import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { listRegions } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://kingkeys.store"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL,              lastModified: new Date(), changeFrequency: "daily",   priority: 1   },
    { url: `${BASE_URL}/store`,   lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE_URL}/account`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/cart`,    lastModified: new Date(), changeFrequency: "never",   priority: 0.3 },
  ]

  try {
    const regions = await listRegions()
    const primaryCountry =
      (regions
        ?.flatMap((r) => r.countries?.map((c) => c.iso_2) ?? [])
        .filter(Boolean)[0] as string) || "es"

    // listProducts devuelve { response: { products, count }, nextPage }
    const result = await listProducts({
      pageParam: 1,
      queryParams: { limit: 200 },
      countryCode: primaryCountry,
    })
    const products: HttpTypes.StoreProduct[] = result.response.products

    const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${BASE_URL}/${primaryCountry}/products/${p.handle}`,
      lastModified: new Date((p.updated_at ?? p.created_at ?? Date.now()) as string),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))

    const categories = await listCategories()
    const categoryRoutes: MetadataRoute.Sitemap = (categories ?? []).map((c) => ({
      url: `${BASE_URL}/${primaryCountry}/categories/${c.handle}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))

    const { collections } = await listCollections({ fields: "id,handle,title" })
    const collectionRoutes: MetadataRoute.Sitemap = (collections ?? []).map((c) => ({
      url: `${BASE_URL}/${primaryCountry}/collections/${c.handle}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))

    return [...staticRoutes, ...productRoutes, ...categoryRoutes, ...collectionRoutes]
  } catch {
    return staticRoutes
  }
}
