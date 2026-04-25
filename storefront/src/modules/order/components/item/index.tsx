import { HttpTypes } from "@medusajs/types"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import Thumbnail from "@modules/products/components/thumbnail"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
  currencyCode: string
}

const Item = ({ item, currencyCode }: ItemProps) => {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-700 last:border-0" data-testid="product-row">
      <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-gray-700 bg-gray-800">
        <Thumbnail thumbnail={item.thumbnail} size="square" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-sm truncate" data-testid="product-name">
          {item.product_title}
        </p>
        <LineItemOptions variant={item.variant} data-testid="product-variant" />
      </div>
      <div className="flex flex-col items-end shrink-0 gap-1">
        <span className="text-gray-300 text-xs" data-testid="product-quantity">
          {item.quantity}x <LineItemUnitPrice item={item} style="tight" currencyCode={currencyCode} />
        </span>
        <span className="text-yellow-400 font-bold text-sm">
          <LineItemPrice item={item} style="tight" currencyCode={currencyCode} />
        </span>
      </div>
    </div>
  )
}

export default Item
