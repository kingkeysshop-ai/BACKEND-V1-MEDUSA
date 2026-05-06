import ChevronDown from "@modules/common/icons/chevron-down"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type OverviewProps = {
  customer: HttpTypes.StoreCustomer | null
  orders: HttpTypes.StoreOrder[] | null
}

const getProfileCompletion = (customer: HttpTypes.StoreCustomer | null) => {
  let count = 0
  if (!customer) return 0
  if (customer.email) count++
  if (customer.first_name && customer.last_name) count++
  if (customer.phone) count++
  if (customer.addresses?.find((addr) => addr.is_default_billing)) count++
  return (count / 4) * 100
}

const Overview = ({ customer, orders }: OverviewProps) => {
  const completion = getProfileCompletion(customer)

  return (
    <div data-testid="overview-page-wrapper" className="flex flex-col gap-6">

      {/* Bienvenida */}
      <div className="bg-gray-900 border border-yellow-400/20 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <p className="text-xs text-yellow-400 font-bold uppercase tracking-widest mb-1">👑 Panel de Control</p>
            <h2 className="text-2xl font-black text-white" data-testid="welcome-message">
              Hola, <span className="text-yellow-400">{customer?.first_name}</span> 👋
            </h2>
          </div>
          <span className="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full">
            {customer?.email}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {/* Perfil completado */}
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 flex flex-col gap-3">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Perfil Completado</p>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black text-white" data-testid="customer-profile-completion">
              {completion}
            </span>
            <span className="text-yellow-400 font-bold text-lg mb-1">%</span>
          </div>
          {/* Barra de progreso */}
          <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-400 rounded-full transition-all duration-500"
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>

        {/* Direcciones */}
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 flex flex-col gap-3">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Direcciones</p>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black text-white" data-testid="addresses-count">
              {customer?.addresses?.length || 0}
            </span>
            <span className="text-gray-500 text-sm mb-1">guardadas</span>
          </div>
          <LocalizedClientLink
            href="/account/addresses"
            className="text-xs text-yellow-400 hover:text-yellow-300 transition-colors font-medium"
          >
            Gestionar →
          </LocalizedClientLink>
        </div>

        {/* Pedidos */}
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 flex flex-col gap-3">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Pedidos</p>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black text-white">
              {orders?.length || 0}
            </span>
            <span className="text-gray-500 text-sm mb-1">realizados</span>
          </div>
          <LocalizedClientLink
            href="/account/orders"
            className="text-xs text-yellow-400 hover:text-yellow-300 transition-colors font-medium"
          >
            Ver todos →
          </LocalizedClientLink>
        </div>
      </div>

      {/* Pedidos recientes */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400">🛒</span>
            <h3 className="text-white font-black text-base">Pedidos Recientes</h3>
          </div>
          <LocalizedClientLink
            href="/account/orders"
            className="text-xs text-yellow-400 hover:text-yellow-300 transition-colors font-medium"
          >
            Ver todos →
          </LocalizedClientLink>
        </div>

        <ul className="flex flex-col divide-y divide-gray-700" data-testid="orders-wrapper">
          {orders && orders.length > 0 ? (
            orders.slice(0, 5).map((order) => (
              <li key={order.id} data-testid="order-wrapper">
                <LocalizedClientLink href={`/account/orders/details/${order.id}`}>
                  <div className="flex justify-between items-center px-6 py-4 hover:bg-gray-800/50 transition-colors duration-200 group">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6">
                      <span className="text-yellow-400 font-black text-sm" data-testid="order-id">
                        #{order.display_id}
                      </span>
                      <span className="text-gray-500 text-xs" data-testid="order-created-date">
                        {new Date(order.created_at).toLocaleDateString("es-ES", {
                          year: "numeric", month: "long", day: "numeric"
                        })}
                      </span>
                      <span className="text-white font-bold text-sm" data-testid="order-amount">
                        {convertToLocale({ amount: order.total, currency_code: order.currency_code })}
                      </span>
                    </div>
                    <ChevronDown className="-rotate-90 text-gray-600 group-hover:text-yellow-400 transition-colors" />
                  </div>
                </LocalizedClientLink>
              </li>
            ))
          ) : (
            <li className="px-6 py-12 flex flex-col items-center gap-3 text-center">
              <span className="text-4xl">🛒</span>
              <p className="text-gray-500 text-sm" data-testid="no-orders-message">
                Aún no tienes pedidos. ¡Explora nuestra tienda!
              </p>
              <LocalizedClientLink
                href="/store"
                className="px-4 py-2 bg-yellow-400 text-gray-900 text-xs font-bold rounded-lg hover:bg-yellow-300 transition-colors"
              >
                🔑 Ver Productos
              </LocalizedClientLink>
            </li>
          )}
        </ul>
      </div>

    </div>
  )
}

export default Overview
