const SkeletonCodeForm = () => {
  return (
    <div className="flex flex-col gap-y-3 animate-pulse">
      <div className="w-24 h-4 bg-gray-800 rounded" />
      <div className="flex gap-2">
        <div className="flex-1 h-10 bg-gray-800 rounded-lg" />
        <div className="w-20 h-10 bg-gray-700 rounded-lg" />
      </div>
    </div>
  )
}

export default SkeletonCodeForm
