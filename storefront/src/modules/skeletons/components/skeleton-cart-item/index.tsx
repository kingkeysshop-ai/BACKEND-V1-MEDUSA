import { Table } from "@medusajs/ui"

const SkeletonCartItem = () => {
  return (
    <Table.Row className="w-full border-gray-800">
      <Table.Cell className="!pl-0 p-4 w-24">
        <div className="w-24 h-24 bg-gray-800 rounded-xl animate-pulse" />
      </Table.Cell>
      <Table.Cell>
        <div className="flex flex-col gap-y-2">
          <div className="w-32 h-4 bg-gray-800 rounded animate-pulse" />
          <div className="w-24 h-3 bg-gray-700 rounded animate-pulse" />
        </div>
      </Table.Cell>
      <Table.Cell>
        <div className="flex gap-2 items-center">
          <div className="w-6 h-8 bg-gray-800 rounded animate-pulse" />
          <div className="w-14 h-10 bg-gray-800 rounded-lg animate-pulse" />
        </div>
      </Table.Cell>
      <Table.Cell>
        <div className="w-12 h-5 bg-gray-800 rounded animate-pulse" />
      </Table.Cell>
      <Table.Cell className="!pr-0 text-right">
        <div className="flex justify-end">
          <div className="w-12 h-5 bg-gray-800 rounded animate-pulse" />
        </div>
      </Table.Cell>
    </Table.Row>
  )
}

export default SkeletonCartItem
