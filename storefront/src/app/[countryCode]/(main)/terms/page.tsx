import Link from "next/link"

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-950 py-16 px-6">
      <div className="max-w-3xl mx-auto flex flex-col gap-10">

        {/* Header */}
        <div className="flex flex-col gap-3">
          <Link href="/" className="text-xs text-yellow-400 font-bold uppercase tracking-widest hover:underline">← Volver al inicio</Link>
          <h1 className="text-4xl font-black text-white">📄 Términos y Condiciones</h1>
          <p className="text-gray-500 text-sm">King Keys — Licencias Digitales Originales</p>
          <div className="h-px bg-gradient-to-r from-yellow-400/40 to-transparent mt-2" />
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-yellow-400">1. Aceptación</h2>
            <p className="text-gray-400 text-sm leading-relaxed">Al realizar una compra en King Keys aceptas estos términos en su totalidad. Si no estás de acuerdo, por favor no utilices nuestros servicios.</p>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-yellow-400">2. Licencias digitales</h2>
            <p className="text-gray-400 text-sm leading-relaxed">Todas las licencias vendidas son originales y válidas. Cada licencia es de uso personal y no puede ser revendida ni transferida a terceros.</p>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-yellow-400">3. Entrega</h2>
            <p className="text-gray-400 text-sm leading-relaxed">Las licencias se entregan de forma inmediata tras la confirmación del pago, al correo electrónico registrado.</p>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-yellow-400">4. Reembolsos</h2>
            <p className="text-gray-400 text-sm leading-relaxed">Aceptamos solicitudes de reembolso dentro de las 24 horas posteriores a la compra, siempre que la licencia no haya sido activada.</p>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-yellow-400">5. Modificaciones</h2>
            <p className="text-gray-400 text-sm leading-relaxed">Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios serán publicados en esta página.</p>
          </div>
        </div>

      </div>
    </div>
  )
}