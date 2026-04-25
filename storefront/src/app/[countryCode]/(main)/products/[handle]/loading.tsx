export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-950 animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="border-b border-gray-800 bg-gray-900 py-3">
        <div className="content-container flex gap-2">
          <div className="w-12 h-3 bg-gray-700 rounded" />
          <div className="w-2 h-3 bg-gray-800 rounded" />
          <div className="w-16 h-3 bg-gray-700 rounded" />
          <div className="w-2 h-3 bg-gray-800 rounded" />
          <div className="w-32 h-3 bg-gray-600 rounded" />
        </div>
      </div>

      {/* Contenido 3 columnas */}
      <div className="content-container flex flex-col small:flex-row py-8 gap-8">
        {/* Izquierda - Info */}
        <div className="flex flex-col gap-4 small:max-w-[300px] w-full">
          <div className="w-3/4 h-7 bg-gray-800 rounded-xl" />
          <div className="w-1/2 h-10 bg-yellow-400/20 rounded-xl" />
          <div className="w-full h-4 bg-gray-800 rounded" />
          <div className="w-5/6 h-4 bg-gray-800 rounded" />
          <div className="w-4/6 h-4 bg-gray-700 rounded" />
          <div className="w-full h-[120px] bg-gray-800 rounded-xl mt-2" />
        </div>

        {/* Centro - Imagen */}
        <div className="flex-1 aspect-[3/4] bg-gray-800 rounded-xl" />

        {/* Derecha - Compra */}
        <div className="flex flex-col gap-4 small:max-w-[300px] w-full">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 flex flex-col gap-4">
            <div className="w-32 h-5 bg-gray-800 rounded" />
            <div className="w-full h-12 bg-gray-800 rounded-xl" />
            <div className="w-full h-12 bg-yellow-400/20 rounded-xl" />
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 flex flex-col gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-3 items-center">
                <div className="w-4 h-4 bg-gray-700 rounded-full" />
                <div className="w-40 h-3 bg-gray-700 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
