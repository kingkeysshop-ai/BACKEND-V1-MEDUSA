import SkeletonButton from "@modules/skeletons/components/skeleton-button"
import SkeletonCartTotals from "@modules/skeletons/components/skeleton-cart-totals"

const SkeletonOrderSummary = () => {
  return (
    <div className="flex flex-col gap-4 bg-gray-900 border border-gray-800 rounded-xl p-5">
      <SkeletonCartTotals header={false} />
      <SkeletonButton />
    </div>
  )
}

export default SkeletonOrderSummary
