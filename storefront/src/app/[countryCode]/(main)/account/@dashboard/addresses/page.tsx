import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getRegion } from "@lib/data/regions"
import { retrieveCustomer } from "@lib/data/customer"
import AddressBook from "@modules/account/components/address-book"

export const metadata: Metadata = {
  title: "Mis Direcciones | King Keys",
  description: "Administra tus direcciones de envío.",
}

export default async function Addresses(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params
  const customer = await retrieveCustomer()
  const region = await getRegion(countryCode)

  if (!customer || !region) notFound()

  return (
    <div className="w-full flex flex-col gap-6" data-testid="addresses-page-wrapper">

      {/* Page header */}
      <div className="bg-gray-900 border border-yellow-400/20 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-yellow-400 text-lg">📍</span>
          <h1 className="text-2xl font-black text-white">
            Mis <span className="text-yellow-400">Direcciones</span>
          </h1>
        </div>
        <p className="text-gray-400 text-sm ml-8">
          Agrega y administra tus direcciones de envío. Se usarán automáticamente en el checkout.
        </p>
      </div>

      {/* Stats pill */}
      <div className="flex items-center gap-3">
        <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-full px-4 py-1.5 flex items-center gap-2">
          <span className="text-yellow-400 font-black text-sm">{customer.addresses?.length ?? 0}</span>
          <span className="text-yellow-400/70 text-xs font-semibold">
            {customer.addresses?.length === 1 ? "dirección guardada" : "direcciones guardadas"}
          </span>
        </div>
      </div>

      {/* Address book */}
      <AddressBook customer={customer} region={region} />

    </div>
  )
}
