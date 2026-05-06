"use client"

import React, { useEffect, useState, useActionState } from "react"
import { PencilSquare as Edit, Trash } from "@medusajs/icons"
import { Heading, Text, clx } from "@medusajs/ui"
import useToggleState from "@lib/hooks/use-toggle-state"
import CountrySelect from "@modules/checkout/components/country-select"
import Input from "@modules/common/components/input"
import Modal from "@modules/common/components/modal"
import Spinner from "@modules/common/icons/spinner"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import { HttpTypes } from "@medusajs/types"
import { deleteCustomerAddress, updateCustomerAddress } from "@lib/data/customer"

type EditAddressProps = {
  region: HttpTypes.StoreRegion
  address: HttpTypes.StoreCustomerAddress
  isActive?: boolean
}

const EditAddress: React.FC<EditAddressProps> = ({ region, address, isActive = false }) => {
  const [removing, setRemoving] = useState(false)
  const [successState, setSuccessState] = useState(false)
  const { state, open, close: closeModal } = useToggleState(false)

  const [formState, formAction] = useActionState(updateCustomerAddress, {
    success: false,
    error: null,
    addressId: address.id,
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

  const removeAddress = async () => {
    setRemoving(true)
    await deleteCustomerAddress(address.id)
    setRemoving(false)
  }

  return (
    <>
      <div
        className={clx(
          "border rounded-xl p-5 min-h-[200px] h-full w-full flex flex-col justify-between transition-all duration-200",
          isActive
            ? "border-yellow-400/60 bg-yellow-400/5"
            : "border-gray-700 bg-gray-900 hover:border-gray-600"
        )}
        data-testid="address-container"
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-start justify-between gap-2">
            <Heading className="text-white font-black text-sm" data-testid="address-name">
              {address.first_name} {address.last_name}
            </Heading>
            {isActive && (
              <span className="text-xs bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 rounded-full px-2 py-0.5 font-bold shrink-0">
                Principal
              </span>
            )}
          </div>
          {address.company && (
            <Text className="text-gray-500 text-xs" data-testid="address-company">
              {address.company}
            </Text>
          )}
          <Text className="flex flex-col text-gray-400 text-xs mt-2 gap-0.5">
            <span data-testid="address-address">
              {address.address_1}
              {address.address_2 && <>, {address.address_2}</>}
            </span>
            <span data-testid="address-postal-city">
              {address.postal_code}, {address.city}
            </span>
            <span data-testid="address-province-country">
              {address.province && `${address.province}, `}
              {address.country_code?.toUpperCase()}
            </span>
          </Text>
        </div>
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-700">
          <button
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-yellow-400 transition-colors font-semibold"
            onClick={open}
            data-testid="address-edit-button"
          >
            <Edit className="w-3.5 h-3.5" />
            Editar
          </button>
          <button
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-400 transition-colors font-semibold"
            onClick={removeAddress}
            data-testid="address-delete-button"
          >
            {removing ? <Spinner /> : <Trash className="w-3.5 h-3.5" />}
            Eliminar
          </button>
        </div>
      </div>

      <Modal isOpen={state} close={close} data-testid="edit-address-modal">
        <Modal.Title>
          <Heading className="mb-2 text-white font-black">✏️ Editar Dirección</Heading>
        </Modal.Title>
        <form action={formAction}>
          <input type="hidden" name="addressId" value={address.id} />
          <Modal.Body>
            <div className="grid grid-cols-1 gap-y-3">
              <div className="grid grid-cols-2 gap-x-3">
                <Input label="Nombre" name="first_name" required autoComplete="given-name" defaultValue={address.first_name || undefined} data-testid="first-name-input" />
                <Input label="Apellido" name="last_name" required autoComplete="family-name" defaultValue={address.last_name || undefined} data-testid="last-name-input" />
              </div>
              <Input label="Empresa (opcional)" name="company" autoComplete="organization" defaultValue={address.company || undefined} data-testid="company-input" />
              <Input label="Dirección" name="address_1" required autoComplete="address-line1" defaultValue={address.address_1 || undefined} data-testid="address-1-input" />
              <Input label="Apartamento, suite, etc." name="address_2" autoComplete="address-line2" defaultValue={address.address_2 || undefined} data-testid="address-2-input" />
              <div className="grid grid-cols-[144px_1fr] gap-x-3">
                <Input label="Código Postal" name="postal_code" required autoComplete="postal-code" defaultValue={address.postal_code || undefined} data-testid="postal-code-input" />
                <Input label="Ciudad" name="city" required autoComplete="locality" defaultValue={address.city || undefined} data-testid="city-input" />
              </div>
              <Input label="Provincia / Estado" name="province" autoComplete="address-level1" defaultValue={address.province || undefined} data-testid="state-input" />
              <CountrySelect name="country_code" region={region} required autoComplete="country" defaultValue={address.country_code || undefined} data-testid="country-select" />
              <Input label="Teléfono" name="phone" autoComplete="tel" defaultValue={address.phone || undefined} data-testid="phone-input" />
            </div>
            {formState.error && (
              <div className="mt-3 bg-red-900/30 border border-red-500/30 rounded-lg px-4 py-2">
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

export default EditAddress
