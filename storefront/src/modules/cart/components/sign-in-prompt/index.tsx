import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SignInPrompt = () => {
  return (
    <LocalizedClientLink href="/account">
      <button
        className="px-4 py-2 bg-yellow-400 text-gray-900 font-bold text-sm rounded-lg hover:bg-yellow-300 transition-all duration-200 whitespace-nowrap"
        data-testid="sign-in-button"
      >
        Iniciar Sesión
      </button>
    </LocalizedClientLink>
  )
}

export default SignInPrompt
