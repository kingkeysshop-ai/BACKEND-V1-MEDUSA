import { login } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { useActionState } from "react"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(login, null)

  return (
    <div className="w-full flex flex-col items-center" data-testid="login-page">
      <h1 className="text-2xl font-black text-white uppercase mb-2 tracking-tight">
        Bienvenido de vuelta 👑
      </h1>
      <p className="text-center text-sm text-gray-400 mb-8">
        Inicia sesión para acceder a tus licencias y pedidos.
      </p>
      <form className="w-full" action={formAction}>
        <div className="flex flex-col w-full gap-y-3">
          <Input
            label="Correo electrónico"
            name="email"
            type="email"
            title="Ingresa un correo válido."
            autoComplete="email"
            required
            data-testid="email-input"
          />
          <Input
            label="Contraseña"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            data-testid="password-input"
          />
        </div>
        <ErrorMessage error={message} data-testid="login-error-message" />
        <SubmitButton data-testid="sign-in-button" className="w-full mt-6">
          Iniciar Sesión
        </SubmitButton>
      </form>
      <span className="text-center text-gray-500 text-sm mt-6">
        ¿Aún no tienes cuenta?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className="text-yellow-400 hover:text-yellow-300 font-bold transition-colors"
          data-testid="register-button"
        >
          Regístrate aquí
        </button>
      </span>
    </div>
  )
}

export default Login
