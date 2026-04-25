const SkeletonOrderConfirmedHeader = () => {
  return (
    <div className="flex flex-col gap-y-3 pb-10 animate-pulse">
      <div className="w-2/5 h-4 bg-gray-800 rounded" />
      <div className="w-3/6 h-7 bg-gray-800 rounded" />
      <div className="flex gap-x-4 mt-1">
        <div className="w-16 h-4 bg-gray-700 rounded" />
        <div className="w-12 h-4 bg-gray-700 rounded" />
      </div>
    </div>
  )
}

export default SkeletonOrderConfirmedHeader
