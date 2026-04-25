"use client"

import { useActionState } from "react"
import Input from "@modules/common/components/input"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { signup } from "@lib/data/customer"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Register = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(signup, null)

  return (
    <div className="w-full flex flex-col items-center" data-testid="register-page">
      <h1 className="text-2xl font-black text-white uppercase mb-2 tracking-tight">
        ¡Bienvenido, Miembro King Keys! 👑
      </h1>
      <p className="text-center text-sm text-gray-400 mb-8">
        Crea tu cuenta y accede a licencias digitales originales con activación inmediata.
      </p>
      <form className="w-full flex flex-col" action={formAction}>
        <div className="flex flex-col w-full gap-y-3">
          <Input
            label="Nombre"
            name="first_name"
            required
            autoComplete="given-name"
            data-testid="first-name-input"
          />
          <Input
            label="Apellido"
            name="last_name"
            required
            autoComplete="family-name"
            data-testid="last-name-input"
          />
          <Input
            label="Correo electrónico"
            name="email"
            required
            type="email"
            autoComplete="email"
            data-testid="email-input"
          />
          <Input
            label="Teléfono"
            name="phone"
            type="tel"
            autoComplete="tel"
            data-testid="phone-input"
          />
          <Input
            label="Contraseña"
            name="password"
            required
            type="password"
            autoComplete="new-password"
            data-testid="password-input"
          />
        </div>
        <ErrorMessage error={message} data-testid="register-error" />
        <span className="text-center text-gray-500 text-xs mt-6">
          Al crear una cuenta aceptas los{" "}
          <LocalizedClientLink href="/content/privacy-policy" className="text-yellow-400 hover:text-yellow-300 transition-colors">
            Términos de Privacidad
          </LocalizedClientLink>{" "}
          y los{" "}
          <LocalizedClientLink href="/content/terms-of-use" className="text-yellow-400 hover:text-yellow-300 transition-colors">
            Términos de Uso
          </LocalizedClientLink>{" "}
          de King Keys.
        </span>
        <SubmitButton className="w-full mt-6" data-testid="register-button">
          Crear mi Cuenta 🔑
        </SubmitButton>
      </form>
      <span className="text-center text-gray-500 text-sm mt-6">
        ¿Ya tienes cuenta?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="text-yellow-400 hover:text-yellow-300 font-bold transition-colors"
        >
          Inicia sesión aquí
        </button>
      </span>
    </div>
  )
}

export default Register
