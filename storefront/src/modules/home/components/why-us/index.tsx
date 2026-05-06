"use client"

import { useEffect, useRef, useState } from "react"

const REASONS = [
  {
    icon: "🔑",
    title: "100% Originales",
    desc: "Todas nuestras licencias provienen directamente de distribuidores oficiales Microsoft. Sin activadores, sin riesgos.",
    stat: "100%",
    statLabel: "Garantizado",
  },
  {
    icon: "⚡",
    title: "Entrega Inmediata",
    desc: "Recibes tu clave de activación por correo en segundos tras confirmar el pago. Sin esperas.",
    stat: "< 1min",
    statLabel: "Tiempo de entrega",
  },
  {
    icon: "🎧",
    title: "Soporte 24/7",
    desc: "Nuestro equipo está disponible todos los días del año para resolver cualquier problema con tu licencia.",
    stat: "24/7",
    statLabel: "Disponibilidad",
  },
  {
    icon: "🛡️",
    title: "Pago Seguro",
    desc: "Procesamos tus pagos con cifrado SSL. Tus datos bancarios nunca se almacenan en nuestros servidores.",
    stat: "SSL",
    statLabel: "Cifrado",
  },
  {
    icon: "💰",
    title: "Mejor Precio",
    desc: "Ofrecemos los precios más competitivos del mercado sin sacrificar la autenticidad del producto.",
    stat: "-70%",
    statLabel: "vs precio retail",
  },
  {
    icon: "🔄",
    title: "Garantía de Reemplazo",
    desc: "Si tu licencia falla por causas ajenas a ti, la reemplazamos sin costo adicional ni preguntas.",
    stat: "∞",
    statLabel: "Soporte post-venta",
  },
]

const WhyUs = () => {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="relative py-20 overflow-hidden">

      {/* Brillo de fondo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-yellow-400 opacity-[0.04] blur-[120px] pointer-events-none" />

      <div className="content-container relative z-10 flex flex-col gap-12">

        {/* Header */}
        <div
          className="flex flex-col items-center text-center gap-3"
          style={{
            transition: "opacity 700ms ease-out, transform 700ms ease-out",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
          }}
        >
          <span className="px-4 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-bold tracking-widest uppercase">
            ⭐ ¿Por qué elegirnos?
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white">
            La elección <span className="text-yellow-400">inteligente</span>
          </h2>
          <p className="text-gray-400 max-w-lg text-sm leading-relaxed">
            Miles de clientes ya confiaron en King Keys. Estas son las razones por las que nos eligen.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {REASONS.map((r, i) => (
            <div
              key={r.title}
              className="group relative bg-gray-900 border border-gray-700 rounded-2xl p-6 flex flex-col gap-4 hover:border-yellow-400/50 hover:shadow-[0_0_30px_rgba(250,204,21,0.07)] transition-all duration-300"
              style={{
                transition: `opacity 600ms ease-out ${i * 100}ms, transform 600ms ease-out ${i * 100}ms, border-color 300ms, box-shadow 300ms`,
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(32px)",
              }}
            >
              {/* Brillo interno hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-400/0 to-yellow-400/0 group-hover:from-yellow-400/5 group-hover:to-transparent transition-all duration-300 pointer-events-none" />

              {/* Icono + stat */}
              <div className="flex items-start justify-between">
                <span className="text-3xl">{r.icon}</span>
                <div className="flex flex-col items-end">
                  <span className="text-xl font-black text-yellow-400 leading-none">{r.stat}</span>
                  <span className="text-[10px] text-gray-600 uppercase tracking-wider">{r.statLabel}</span>
                </div>
              </div>

              {/* Texto */}
              <div className="flex flex-col gap-1.5">
                <h3 className="text-white font-bold text-base">{r.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Barra de confianza */}
        <div
          className="flex flex-wrap items-center justify-center gap-6 pt-6 border-t border-gray-800"
          style={{
            transition: "opacity 700ms ease-out 700ms, transform 700ms ease-out 700ms",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
          }}
        >
          {[
            { icon: "✅", text: "+5,000 clientes satisfechos" },
            { icon: "🌟", text: "4.9/5 valoración media" },
            { icon: "📦", text: "+10,000 licencias entregadas" },
            { icon: "🇨🇴", text: "Operamos desde Colombia" },
          ].map((b) => (
            <div key={b.text} className="flex items-center gap-2 text-sm text-gray-500">
              <span>{b.icon}</span>
              <span>{b.text}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default WhyUs