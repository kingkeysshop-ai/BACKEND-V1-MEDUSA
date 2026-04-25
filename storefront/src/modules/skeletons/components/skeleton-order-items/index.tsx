import repeat from "@lib/util/repeat"

const SkeletonOrderItems = () => {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      {repeat(3).map((i) => (
        <div key={i} className="flex gap-4 items-center p-4 bg-gray-900 border border-gray-800 rounded-xl">
          <div className="w-16 h-16 bg-gray-800 rounded-lg shrink-0" />
          <div className="flex flex-col gap-2 flex-1">
            <div className="w-3/5 h-4 bg-gray-800 rounded" />
            <div className="w-2/5 h-3 bg-gray-700 rounded" />
          </div>
          <div className="w-16 h-5 bg-gray-800 rounded" />
        </div>
      ))}
    </div>
  )
}

export default SkeletonOrderItems
