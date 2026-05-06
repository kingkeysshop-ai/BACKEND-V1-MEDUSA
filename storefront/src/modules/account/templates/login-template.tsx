"use client"

import { useState } from "react"
import Register from "@modules/account/components/register"
import Login from "@modules/account/components/login"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

const LoginTemplate = () => {
  const [currentView, setCurrentView] = useState("sign-in")

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        <button
          onClick={() => setCurrentView("sign-in")}
          className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-all duration-200 ${
            currentView === "sign-in"
              ? "bg-yellow-400 text-gray-900"
              : "text-gray-400 hover:text-white bg-transparent"
          }`}
        >
          Iniciar Sesión
        </button>
        <button
          onClick={() => setCurrentView("register")}
          className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-all duration-200 ${
            currentView === "register"
              ? "bg-yellow-400 text-gray-900"
              : "text-gray-400 hover:text-white bg-transparent"
          }`}
        >
          Registrarse
        </button>
      </div>

      {/* Formulario */}
      <div className="p-10">
        {currentView === "sign-in" ? (
          <Login setCurrentView={setCurrentView} />
        ) : (
          <Register setCurrentView={setCurrentView} />
        )}
      </div>
    </div>
  )
}

export default LoginTemplate
