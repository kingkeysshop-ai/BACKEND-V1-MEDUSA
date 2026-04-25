import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items
  return (
    <div className="w-full">
      <div className="grid grid-cols-[64px_1fr_96px_80px_64px] gap-4 px-6 py-3 border-b border-gray-700 text-xs text-gray-500 font-bold uppercase tracking-widest">
        <span></span>
        <span>Producto</span>
        <span className="text-center">Cantidad</span>
        <span className="hidden small:block text-right">Precio</span>
        <span className="text-right">Total</span>
      </div>
      <table className="w-full">
        <tbody>
          {items
            ? items
                .sort((a, b) => (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1)
                .map((item) => (
                  <Item key={item.id} item={item} currencyCode={cart?.currency_code} />
                ))
            : repeat(5).map((i) => <SkeletonLineItem key={i} />)}
        </tbody>
      </table>
    </div>
  )
}

export default ItemsTemplate
