import { VariantPrice } from "types/global"

export default async function PreviewPrice({ price }: { price: VariantPrice }) {
  if (!price) return null

  return (
    <div className="flex flex-col">
      {price.price_type === "sale" && (
        <span className="line-through text-gray-600 text-xs" data-testid="original-price">
          {price.original_price}
        </span>
      )}
      <span
        className={
          price.price_type === "sale"
            ? "text-yellow-400 font-black text-base"
            : "text-white font-bold text-base"
        }
        data-testid="price"
      >
        {price.calculated_price}
      </span>
    </div>
  )
}
