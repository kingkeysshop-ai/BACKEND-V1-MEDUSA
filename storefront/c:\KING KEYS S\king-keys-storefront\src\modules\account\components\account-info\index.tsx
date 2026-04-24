import { Disclosure } from "@headlessui/react"
import { clx } from "@medusajs/ui"
import { useEffect } from "react"
import useToggleState from "@lib/hooks/use-toggle-state"
import { useFormStatus } from "react-dom"

type AccountInfoProps = {
  label: string
  currentInfo: string | React.ReactNode
  isSuccess?: boolean
  isError?: boolean
  errorMessage?: string
  clearState: () => void
  children?: React.ReactNode
  "data-testid"?: string
}

const AccountInfo = ({
  label,
  currentInfo,
  isSuccess,
  isError,
  clearState,
  errorMessage = "Ocurrió un error, por favor intenta de nuevo",
  children,
  "data-testid": dataTestid,
}: AccountInfoProps) => {
  const { state, close, toggle } = useToggleState()
  const { pending } = useFormStatus()

  const handleToggle = () => {
    clearState()
    setTimeout(() => toggle(), 100)
  }

  useEffect(() => {
    if (isSuccess) close()
  }, [isSuccess, close])

  return (
    <div
      className="bg-gray-900 border border-gray-700 rounded-xl p-5 transition-all duration-200 hover:border-yellow-400/30"
      data-testid={dataTestid}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">{label}</span>
          <div className="text-white font-semibold text-sm truncate" data-testid="current-info">
            {currentInfo}
          </div>
        </div>
        <button
          onClick={handleToggle}
          type={state ? "reset" : "button"}
          data-testid="edit-button"
          data-active={state}
          className={clx(
            "shrink-0 px-4 py-1.5 rounded-lg text-xs font-bold border transition-all duration-200",
            state
              ? "border-gray-600 text-gray-400 hover:border-red-500/50 hover:text-red-400 bg-gray-800"
              : "border-yellow-400/50 text-yellow-400 hover:bg-yellow-400 hover:text-gray-900 bg-transparent"
          )}
        >
          {state ? "Cancelar" : "Editar"}
        </button>
      </div>

      <Disclosure>
        <Disclosure.Panel static className={clx("transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden", { "max-h-[100px] opacity-100": isSuccess, "max-h-0 opacity-0": !isSuccess })} data-testid="success-message">
          <div className="mt-3 bg-green-900/30 border border-green-500/30 rounded-lg px-4 py-2">
            <span className="text-green-400 text-xs font-semibold">✅ {label} actualizado correctamente</span>
          </div>
        </Disclosure.Panel>
      </Disclosure>

      <Disclosure>
        <Disclosure.Panel static className={clx("transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden", { "max-h-[100px] opacity-100": isError, "max-h-0 opacity-0": !isError })} data-testid="error-message">
          <div className="mt-3 bg-red-900/30 border border-red-500/30 rounded-lg px-4 py-2">
            <span className="text-red-400 text-xs font-semibold">⚠️ {errorMessage}</span>
          </div>
        </Disclosure.Panel>
      </Disclosure>

      <Disclosure>
        <Disclosure.Panel static className={clx("transition-[max-height,opacity] duration-300 ease-in-out overflow-visible", { "max-h-[1000px] opacity-100": state, "max-h-0 opacity-0": !state })}>
          <div className="flex flex-col gap-4 pt-4 mt-4 border-t border-gray-700">
            <div>{children}</div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={pending}
                data-testid="save-button"
                className={clx("px-6 py-2.5 rounded-lg text-sm font-black transition-all duration-200", pending ? "bg-yellow-400/50 text-gray-900/50 cursor-not-allowed" : "bg-yellow-400 text-gray-900 hover:bg-yellow-300 hover:shadow-lg hover:shadow-yellow-400/20 active:scale-95")}
              >
                {pending ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </div>
        </Disclosure.Panel>
      </Disclosure>
    </div>
  )
}

export default AccountInfo
