"use client"
import React, { useActionState } from "react"
import Input from "@modules/common/components/input"
import AccountInfo from "../account-info"
import { HttpTypes } from "@medusajs/types"

type MyInformationProps = {
  customer: HttpTypes.StoreCustomer
}

const ProfilePassword: React.FC<MyInformationProps> = ({ customer }) => {
  const [successState, setSuccessState] = React.useState(false)

  const updatePassword = async (
    _currentState: Record<string, unknown>,
    formData: FormData
  ) => {
    return { success: false, error: "La actualización de contraseña no está disponible aún." }
  }

  const [state, formAction] = useActionState(updatePassword, {
    error: "",
    success: false,
  })

  const clearState = () => setSuccessState(false)

  return (
    <form action={formAction} onReset={() => clearState()} className="w-full">
      <AccountInfo
        label="Contraseña"
        currentInfo={
          <span className="text-gray-500 italic text-xs">
            🔒 La contraseña está oculta por seguridad
          </span>
        }
        isSuccess={successState}
        isError={false}
        errorMessage={undefined}
        clearState={clearState}
        data-testid="account-password-editor"
      >
        <div className="grid grid-cols-1 small:grid-cols-2 gap-3">
          <Input
            label="Contraseña actual"
            name="old_password"
            required
            type="password"
            data-testid="old-password-input"
          />
          <Input
            label="Nueva contraseña"
            type="password"
            name="new_password"
            required
            data-testid="new-password-input"
          />
          <Input
            label="Confirmar contraseña"
            type="password"
            name="confirm_password"
            required
            data-testid="confirm-password-input"
          />
        </div>
        <p className="text-xs text-gray-500 italic mt-2">
          ⚠️ La actualización de contraseña no está disponible actualmente.
        </p>
      </AccountInfo>
    </form>
  )
}

export default ProfilePassword
