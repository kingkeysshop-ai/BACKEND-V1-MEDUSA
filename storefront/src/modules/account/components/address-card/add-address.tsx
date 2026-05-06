"use client"

import { Plus } from "@medusajs/icons"
import { Heading } from "@medusajs/ui"
import { useEffect, useState, useActionState } from "react"
import useToggleState from "@lib/hooks/use-toggle-state"
import CountrySelect from "@modules/checkout/components/country-select"
import Input from "@modules/common/components/input"
import Modal from "@modules/common/components/modal"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import { HttpTypes } from "@medusajs/types"
import { addCustomerAddress } from "@lib/data/customer"

const AddAddress = ({
  region,
  addresses,
}: {
  region: HttpTypes.StoreRegion
  addresses: HttpTypes.StoreCustomerAddress[]
}) => {
  const [successState, setSuccessState] = useState(false)
  const { state, open, close: closeModal } = useToggleState(false)

  const [formState, formAction] = useActionState(addCustomerAddress, {
    isDefaultShipping: addresses.length === 0,
    success: false,
    error: null,
  })

  const close = () => {
    setSuccessState(false)
    closeModal()
  }

  useEffect(() => {
    if (successState) close()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successState])

  useEffect(() => {
    if (formState.success) setSuccessState(true)
  }, [formState])

  return (
    <>
      <button
        className="group border-2 border-dashed border-gray-700 hover:border-yellow-400/50 rounded-xl p-5 min-h-[200px] h-full w-full flex flex-col items-center justify-center gap-3 transition-all duration-200 hover:bg-yellow-400/5"
        onClick={open}
        data-testid="add-address-button"
      >
        <div className="w-12 h-12 rounded-full bg-gray-800 group-hover:bg-yellow-400/10 border border-gray-700 group-hover:border-yellow-400/40 flex items-center justify-center transition-all duration-200">
          <Plus className="text-gray-500 group-hover:text-yellow-400 transition-colors" />
        </div>
        <span className="text-sm font-bold text-gray-500 group-hover:text-yellow-400 transition-colors">
          Nueva Dirección
        </span>
      </button>

      <Modal isOpen={state} close={close} data-testid="add-address-modal">
        <Modal.Title>
          <Heading className="mb-2 text-white font-black">➕ Agregar Dirección</Heading>
        </Modal.Title>
        <form action={formAction}>
          <Modal.Body>
            <div className="flex flex-col gap-y-3">
              <div className="grid grid-cols-2 gap-x-3">
                <Input label="Nombre" name="first_name" required autoComplete="given-name" data-testid="first-name-input" />
                <Input label="Apellido" name="last_name" required autoComplete="family-name" data-testid="last-name-input" />
              </div>
              <Input label="Empresa (opcional)" name="company" autoComplete="organization" data-testid="company-input" />
              <Input label="Dirección" name="address_1" required autoComplete="address-line1" data-testid="address-1-input" />
              <Input label="Apartamento, suite, etc." name="address_2" autoComplete="address-line2" data-testid="address-2-input" />
              <div className="grid grid-cols-[144px_1fr] gap-x-3">
                <Input label="Código Postal" name="postal_code" required autoComplete="postal-code" data-testid="postal-code-input" />
                <Input label="Ciudad" name="city" required autoComplete="locality" data-testid="city-input" />
              </div>
              <Input label="Provincia / Estado" name="province" autoComplete="address-level1" data-testid="state-input" />
              <CountrySelect region={region} name="country_code" required autoComplete="country" data-testid="country-select" />
              <Input label="Teléfono" name="phone" autoComplete="tel" data-testid="phone-input" />
            </div>
            {formState.error && (
              <div className="mt-3 bg-red-900/30 border border-red-500/30 rounded-lg px-4 py-2" data-testid="address-error">
                <span className="text-red-400 text-xs font-semibold">⚠️ {formState.error}</span>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <div className="flex gap-3 mt-6">
              <button
                type="reset"
                onClick={close}
                className="flex-1 h-10 rounded-lg border border-gray-600 text-gray-400 text-sm font-bold hover:border-gray-500 hover:text-white transition-all duration-200"
                data-testid="cancel-button"
              >
                Cancelar
              </button>
              <SubmitButton data-testid="save-button">Guardar</SubmitButton>
            </div>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  )
}

export default AddAddress
