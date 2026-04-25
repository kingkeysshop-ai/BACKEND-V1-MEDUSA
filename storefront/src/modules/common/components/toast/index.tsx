"use client"

import { useEffect, useState } from "react"
import { useToast, Toast as ToastType } from "@lib/context/toast-context"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const ToastItem = ({ toast }: { toast: ToastType }) => {
  const { removeToast } = useToast()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 20)
    return () => clearTimeout(t)
  }, [])

  const isSuccess = toast.type === "success"

  return (
    <div
      role="alert"
      className="flex items-start gap-3 w-80 rounded-xl border p-4 shadow-2xl shadow-black backdrop-blur-md transition-all duration-300"
      style={{
        background: "rgba(17,24,39,0.97)",
        borderColor: isSuccess ? "rgba(250,204,21,0.35)" : "rgba(239,68,68,0.35)",
        boxShadow: isSuccess
          ? "0 0 24px rgba(250,204,21,0.12), 0 8px 32px rgba(0,0,0,0.5)"
          : "0 0 24px rgba(239,68,68,0.12), 0 8px 32px rgba(0,0,0,0.5)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(16px) scale(0.96)",
      }}
    >
      {/* Icono */}
      <span className="text-xl shrink-0 mt-0.5">
        {isSuccess ? "✅" : "⚠️"}
      </span>

      {/* Texto */}
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <p
          className="text-sm font-bold leading-snug"
          style={{ color: isSuccess ? "#facc15" : "#f87171" }}
        >
          {toast.message}
        </p>
        {toast.subtitle && (
          <p className="text-xs text-gray-400 truncate">{toast.subtitle}</p>
        )}
        {isSuccess && (
          <LocalizedClientLink
            href="/cart"
            className="text-xs text-gray-500 hover:text-yellow-400 transition-colors duration-200 mt-1 w-fit"
          >
            Ver carrito →
          </LocalizedClientLink>
        )}
      </div>

      {/* Cerrar */}
      <button
        onClick={() => removeToast(toast.id)}
        className="shrink-0 text-gray-600 hover:text-gray-300 transition-colors duration-200 text-base leading-none mt-0.5"
        aria-label="Cerrar"
      >
        ×
      </button>
    </div>
  )
}

const ToastContainer = () => {
  const { toasts } = useToast()

  return (
    <div
      aria-live="polite"
      className="fixed bottom-20 right-4 small:bottom-6 small:right-6 z-[200] flex flex-col gap-3 items-end pointer-events-none"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} />
        </div>
      ))}
    </div>
  )
}

export default ToastContainer