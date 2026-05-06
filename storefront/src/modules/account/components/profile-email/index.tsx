"use client"

import React, { useEffect, useActionState } from "react"
import Input from "@modules/common/components/input"
import AccountInfo from "../account-info"
import { HttpTypes } from "@medusajs/types"

type MyInformationProps = {
  customer: HttpTypes.StoreCustomer
}

const ProfileEmail: React.FC<MyInformationProps> = ({ customer }) => {
  const [successState, setSuccessState] = React.useState(false)

  const updateCustomerEmail = (
    _currentState: { success: boolean; error: null },
    formData: FormData
  ): { success: boolean; error: null } => {
    return { success: false, error: null }
  }

  const [state, formAction] = useActionState(updateCustomerEmail, {
    error: null,
    success: false,
  })

  const clearState = () => setSuccessState(false)

  useEffect(() => {
    setSuccessState(state.success)
  }, [state])

  return (
    <form action={formAction} className="w-full">
      <AccountInfo
        label="Correo Electrónico"
        currentInfo={customer.email}
        isSuccess={successState}
        isError={false}
        clearState={clearState}
        data-testid="account-email-editor"
      >
        <div className="grid grid-cols-1 gap-3">
          <Input
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={customer.email}
            data-testid="email-input"
          />
          <p className="text-xs text-gray-500 italic">
            ⚠️ La actualización de email no está disponible actualmente.
          </p>
        </div>
      </AccountInfo>
    </form>
  )
}

export default ProfileEmail
