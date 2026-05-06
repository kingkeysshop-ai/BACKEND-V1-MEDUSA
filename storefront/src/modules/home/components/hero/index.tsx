"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: (i % 3) * 2 + 3,
  x: (i * 17 + 5) % 100,
  y: (i * 23 + 10) % 100,
  duration: (i % 4) + 6,
  delay: (i % 5) * 1.2,
  opacity: (i % 4) * 0.08 + 0.08,
}))

const STATS = [
  { value: "100%", label: "Original" },
  { value: "24/7", label: "Soporte" },
  { value: "5K+", label: "Clientes" },
]

const Hero = () => {
  const [mounted, setMounted] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50)
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      clearTimeout(t)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return (
    <div className="relative w-full min-h-[90vh] bg-gradient-to-br from-gray-950 via-gray-900 to-black overflow-hidden flex items-center justify-center">

      {/* Brillo dorado parallax */}
      <div
        className="absolute top-[-15%] left-1/2 w-[700px] h-[700px] rounded-full bg-yellow-400 opacity-[0.06] blur-[120px] pointer-events-none"
        style={{ transform: `translateY(${scrollY * 0.25}px) translateX(-50%)` }}
      />
      <div className="absolute bottom-0 right-[-10%] w-[400px] h-[400px] rounded-full bg-yellow-500 opacity-[0.04] blur-[100px] pointer-events-none" />

      {/* Particulas flotantes */}
      {PARTICLES.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full bg-yellow-400 pointer-events-none"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            opacity: p.opacity,
            animation: `heroFloat ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
          }}
        />
      ))}

      {/* Grid de puntos de fondo */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, #facc15 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Contenido principal */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 md:px-12 gap-6 py-24">

        {/* Badge */}
        <div
          style={{
            transition: "opacity 700ms ease-out, transform 700ms ease-out",
            transitionDelay: "0ms",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(-16px)",
          }}
        >
          <span className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-bold tracking-widest uppercase backdrop-blur-sm hover:bg-yellow-400/20 transition-colors duration-300 cursor-default">
            <span style={{ display: "inline-block", animation: "heroSpin 8s linear infinite" }}>🔑</span>
            Licencias Digitales Originales
          </span>
        </div>

        {/* Titulo KING / KEYS */}
        <div
          className="flex flex-col items-center leading-none"
          style={{
            transition: "opacity 700ms ease-out 150ms, transform 700ms ease-out 150ms",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(24px)",
          }}
        >
          <h1
            className="text-7xl md:text-8xl lg:text-9xl font-black text-white tracking-tight leading-none"
            style={{ filter: "drop-shadow(0 0 40px rgba(250,204,21,0.12))" }}
          >
            KING
          </h1>
          <h1
            className="text-7xl md:text-8xl lg:text-9xl font-black tracking-tight leading-none"
            style={{
              background: "linear-gradient(135deg, #facc15 0%, #fde68a 50%, #f59e0b 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 30px rgba(250,204,21,0.4))",
            }}
          >
            KEYS
          </h1>
        </div>

        {/* Subtitulo */}
        <div
          style={{
            transition: "opacity 700ms ease-out 300ms, transform 700ms ease-out 300ms",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(24px)",
          }}
        >
          <p className="text-lg md:text-xl text-gray-400 max-w-lg leading-relaxed">
            Las mejores licencias digitales al mejor precio.{" "}
            <span className="text-yellow-400/80 font-semibold">Windows, Office, antivirus y más</span>
            {" "}— activación inmediata garantizada.
          </p>
        </div>

        {/* Botones */}
        <div
          className="flex flex-col sm:flex-row gap-4 mt-2"
          style={{
            transition: "opacity 700ms ease-out 450ms, transform 700ms ease-out 450ms",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(24px)",
          }}
        >
          <Link
            href="/store"
            className="group relative px-9 py-3.5 bg-yellow-400 text-gray-900 font-black rounded-xl text-base overflow-hidden hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(250,204,21,0.45)] transition-all duration-300"
          >
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none" />
            <span className="relative">🛒 Ver Productos</span>
          </Link>
          <Link
            href="/account"
            className="px-9 py-3.5 border-2 border-yellow-400/60 text-yellow-400 font-bold rounded-xl text-base hover:border-yellow-400 hover:bg-yellow-400/10 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(250,204,21,0.15)] transition-all duration-300"
          >
            Mi Cuenta
          </Link>
        </div>

        {/* Stats */}
        <div
          className="flex gap-8 md:gap-16 mt-6 pt-6 border-t border-gray-700/60"
          style={{
            transition: "opacity 700ms ease-out 600ms, transform 700ms ease-out 600ms",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(24px)",
          }}
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1 group cursor-default">
              <span className="text-2xl font-black text-yellow-400 group-hover:scale-110 transition-transform duration-200">
                {stat.value}
              </span>
              <span className="text-xs text-gray-500 uppercase tracking-widest group-hover:text-gray-400 transition-colors duration-200">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        style={{
          transition: "opacity 700ms ease-out 900ms, transform 700ms ease-out 900ms",
          opacity: mounted && scrollY < 80 ? 1 : 0,
          transform: mounted && scrollY < 80 ? "translateY(0)" : "translateY(12px)",
        }}
      >
        <span className="text-[10px] text-gray-600 uppercase tracking-[0.2em]">Scroll</span>
        <div className="w-5 h-8 rounded-full border-2 border-gray-700 flex items-start justify-center p-1">
          <div
            className="w-1 h-2 bg-yellow-400 rounded-full"
            style={{ animation: "scrollDot 1.8s ease-in-out infinite" }}
          />
        </div>
      </div>

      {/* Linea decorativa inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent" />

      {/* Keyframes */}
      <style>{`
        @keyframes heroFloat {
          0%   { transform: translateY(0px) translateX(0px) scale(1); }
          50%  { transform: translateY(-18px) translateX(8px) scale(1.15); }
          100% { transform: translateY(-30px) translateX(-6px) scale(0.85); }
        }
        @keyframes scrollDot {
          0%   { transform: translateY(0); opacity: 1; }
          80%  { transform: translateY(12px); opacity: 0; }
          100% { transform: translateY(0); opacity: 0; }
        }
        @keyframes heroSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default Hero
