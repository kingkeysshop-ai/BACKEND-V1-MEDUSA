import { Table } from "@medusajs/ui"
import repeat from "@lib/util/repeat"
import SkeletonCartItem from "@modules/skeletons/components/skeleton-cart-item"
import SkeletonCodeForm from "@modules/skeletons/components/skeleton-code-form"
import SkeletonOrderSummary from "@modules/skeletons/components/skeleton-order-summary"

const SkeletonCartPage = () => {
  return (
    <div className="py-12 bg-gray-950 min-h-screen">
      <div className="content-container">
        <div className="grid grid-cols-1 small:grid-cols-[1fr_360px] gap-8">

          {/* Cart items skeleton */}
          <div className="flex flex-col bg-gray-900 border border-gray-800 rounded-xl p-6 gap-y-6 animate-pulse">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-y-2">
                <div className="w-60 h-7 bg-gray-800 rounded-lg" />
                <div className="w-40 h-5 bg-gray-700 rounded-lg" />
              </div>
              <div className="w-14 h-8 bg-gray-800 rounded-lg" />
            </div>
            <Table>
              <Table.Header className="border-t-0 border-b border-gray-800">
                <Table.Row className="border-gray-800">
                  <Table.HeaderCell className="!pl-0">
                    <div className="w-10 h-5 bg-gray-800 rounded" />
                  </Table.HeaderCell>
                  <Table.HeaderCell />
                  <Table.HeaderCell><div className="w-16 h-5 bg-gray-800 rounded" /></Table.HeaderCell>
                  <Table.HeaderCell><div className="w-12 h-5 bg-gray-800 rounded" /></Table.HeaderCell>
                  <Table.HeaderCell className="!pr-0">
                    <div className="flex justify-end"><div className="w-12 h-5 bg-gray-800 rounded" /></div>
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {repeat(4).map((index) => (
                  <SkeletonCartItem key={index} />
                ))}
              </Table.Body>
            </Table>
          </div>

          {/* Summary skeleton */}
          <div className="flex flex-col gap-y-4">
            <SkeletonOrderSummary />
            <SkeletonCodeForm />
          </div>

        </div>
      </div>
    </div>
  )
}

export default SkeletonCartPage
