"use client"

import React from "react"
import AccountNav from "../components/account-nav"
import { HttpTypes } from "@medusajs/types"

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: (i % 3) * 2 + 3,
  x: (i * 17 + 5) % 100,
  y: (i * 23 + 10) % 100,
  duration: (i % 4) + 6,
  delay: (i % 5) * 1.2,
  opacity: (i % 4) * 0.08 + 0.08,
}))

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({ customer, children }) => {

  if (!customer) {
    return (
      <div className="relative min-h-screen bg-gray-950 flex items-center justify-center px-4 py-16 overflow-hidden">

        {/* Brillo dorado */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-yellow-400 opacity-[0.05] blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-[-10%] w-[350px] h-[350px] rounded-full bg-yellow-500 opacity-[0.04] blur-[100px] pointer-events-none" />

        {/* Grid de puntos */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: "radial-gradient(circle, #facc15 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

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
              animation: `accountFloat ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
            }}
          />
        ))}

        {/* Contenido */}
        <div className="relative z-10 w-full max-w-2xl flex flex-col items-center gap-8">
          <a href="/" className="text-3xl font-black tracking-widest uppercase">
            <span className="text-white">KING</span>
            <span className="text-yellow-400"> KEYS</span>
          </a>
          <div className="w-full bg-gray-900/80 backdrop-blur-sm border border-yellow-400/20 rounded-2xl overflow-hidden shadow-2xl shadow-black">
            {children}
          </div>
          <div className="flex gap-10">
            {[
              { icon: "🔒", text: "Acceso Seguro" },
              { icon: "⚡", text: "Entrega Inmediata" },
              { icon: "🎧", text: "Soporte 24/7" },
            ].map((g) => (
              <div key={g.text} className="flex flex-col items-center gap-1">
                <span className="text-2xl">{g.icon}</span>
                <span className="text-xs text-gray-600">{g.text}</span>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes accountFloat {
            0%   { transform: translateY(0px) translateX(0px) scale(1); }
            50%  { transform: translateY(-18px) translateX(8px) scale(1.15); }
            100% { transform: translateY(-30px) translateX(-6px) scale(0.85); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-gray-950 overflow-hidden" data-testid="account-page">

      {/* Brillo dorado */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-yellow-400 opacity-[0.04] blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-[-5%] w-[400px] h-[400px] rounded-full bg-yellow-500 opacity-[0.03] blur-[100px] pointer-events-none" />

      {/* Grid de puntos */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: "radial-gradient(circle, #facc15 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

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
            opacity: p.opacity * 0.6,
            animation: `accountFloat ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
          }}
        />
      ))}

      {/* Header */}
      <div className="relative z-10 border-b border-yellow-400/20 bg-gray-900/80 backdrop-blur-sm">
        <div className="content-container py-8 flex flex-col gap-1">
          <span className="text-xs text-yellow-400 font-bold uppercase tracking-widest">👤 King Keys</span>
          <h1 className="text-3xl font-black text-white">Mi <span className="text-yellow-400">Cuenta</span></h1>
        </div>
      </div>

      <div className="relative z-10 content-container py-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 small:grid-cols-[260px_1fr] gap-8">

          {/* Sidebar */}
          <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-xl p-4 h-fit small:sticky small:top-20">
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-700">
              <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-gray-900 font-black text-lg">
                {customer.first_name?.[0]?.toUpperCase() ?? "👤"}
              </div>
              <div>
                <p className="text-white font-bold text-sm">{customer.first_name} {customer.last_name}</p>
                <p className="text-gray-500 text-xs truncate max-w-[160px]">{customer.email}</p>
              </div>
            </div>
            <AccountNav customer={customer} />
          </div>

          {/* Contenido */}
          <div className="flex-1 min-w-0">{children}</div>
        </div>

        {/* Footer soporte */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col small:flex-row items-start small:items-center justify-between gap-4">
          <div>
            <h3 className="text-white font-bold text-lg mb-1">¿Necesitas ayuda?</h3>
            <p className="text-gray-400 text-sm">Nuestro equipo está disponible 24/7 para ayudarte.</p>
          </div>
          <a
            href="/store"
            className="px-6 py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg text-sm hover:bg-yellow-300 transition-all duration-200 whitespace-nowrap"
          >
            🎧 Contactar Soporte
          </a>
        </div>
      </div>

      <style>{`
        @keyframes accountFloat {
          0%   { transform: translateY(0px) translateX(0px) scale(1); }
          50%  { transform: translateY(-18px) translateX(8px) scale(1.15); }
          100% { transform: translateY(-30px) translateX(-6px) scale(0.85); }
        }
      `}</style>
    </div>
  )
}

export default AccountLayout