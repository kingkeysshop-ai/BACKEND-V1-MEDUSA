import Link from "next/link"

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-950 py-16 px-6">
      <div className="max-w-3xl mx-auto flex flex-col gap-10">

        {/* Header */}
        <div className="flex flex-col gap-3">
          <Link href="/" className="text-xs text-yellow-400 font-bold uppercase tracking-widest hover:underline">← Volver al inicio</Link>
          <h1 className="text-4xl font-black text-white">🔒 Política de Privacidad</h1>
          <p className="text-gray-500 text-sm">King Keys — Licencias Digitales Originales</p>
          <div className="h-px bg-gradient-to-r from-yellow-400/40 to-transparent mt-2" />
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-yellow-400">1. Datos que recopilamos</h2>
            <p className="text-gray-400 text-sm leading-relaxed">Recopilamos tu nombre, correo electrónico y dirección de facturación cuando realizas una compra. No almacenamos datos de tarjetas de crédito.</p>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-yellow-400">2. Uso de la información</h2>
            <p className="text-gray-400 text-sm leading-relaxed">Usamos tus datos exclusivamente para procesar pedidos, enviar licencias digitales y brindarte soporte. No vendemos ni compartimos tu información con terceros.</p>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-yellow-400">3. Cookies</h2>
            <p className="text-gray-400 text-sm leading-relaxed">Utilizamos cookies para mejorar tu experiencia de navegación y recordar tu sesión. Puedes desactivarlas desde la configuración de tu navegador.</p>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-yellow-400">4. Seguridad</h2>
            <p className="text-gray-400 text-sm leading-relaxed">Toda la información se transmite mediante conexiones HTTPS cifradas. Tomamos medidas técnicas para proteger tus datos.</p>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-yellow-400">5. Contacto</h2>
            <p className="text-gray-400 text-sm leading-relaxed">Si tienes preguntas sobre tu privacidad, contáctanos en soporte@kingkeys.com</p>
          </div>
        </div>

      </div>
    </div>
  )
}