import SkeletonOrderConfirmedHeader from "@modules/skeletons/components/skeleton-order-confirmed-header"
import SkeletonOrderInformation from "@modules/skeletons/components/skeleton-order-information"
import SkeletonOrderItems from "@modules/skeletons/components/skeleton-order-items"
import SkeletonCartTotals from "@modules/skeletons/components/skeleton-cart-totals"

const SkeletonOrderConfirmed = () => {
  return (
    <div className="bg-gray-950 min-h-screen py-12">
      <div className="content-container max-w-4xl mx-auto flex flex-col gap-8">
        <SkeletonOrderConfirmedHeader />
        <div className="grid grid-cols-1 small:grid-cols-[1fr_280px] gap-8">
          <div className="flex flex-col gap-6">
            <SkeletonOrderItems />
            <SkeletonOrderInformation />
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <SkeletonCartTotals header={true} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkeletonOrderConfirmed
