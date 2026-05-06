import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "404 - Página no encontrada | King Keys",
  description: "La página que buscas no existe.",
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="flex flex-col items-center text-center gap-6 max-w-lg">

        {/* Glowing 404 */}
        <div className="relative">
          <span className="text-[120px] font-black text-gray-800 leading-none select-none">
            404
          </span>
          <span className="absolute inset-0 flex items-center justify-center text-[120px] font-black text-yellow-400/10 leading-none blur-2xl select-none">
            404
          </span>
        </div>

        {/* Crown icon */}
        <div className="w-16 h-16 rounded-full bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-3xl -mt-6">
          👑
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-black text-white">
            Página <span className="text-yellow-400">no encontrada</span>
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            La página que intentas visitar no existe o fue movida.
            <br />
            Vuelve al inicio y sigue explorando King Keys.
          </p>
        </div>

        <div className="flex flex-col small:flex-row gap-3 w-full small:w-auto">
          <Link
            href="/"
            className="px-6 py-3 bg-yellow-400 text-gray-900 font-black rounded-xl text-sm hover:bg-yellow-300 transition-all duration-200 hover:shadow-lg hover:shadow-yellow-400/20 active:scale-95"
          >
            🏠 Ir al Inicio
          </Link>
          <Link
            href="/store"
            className="px-6 py-3 border border-gray-700 text-gray-300 font-bold rounded-xl text-sm hover:border-yellow-400/40 hover:text-white transition-all duration-200"
          >
            🔑 Ver Productos
          </Link>
        </div>

      </div>
    </div>
  )
}
