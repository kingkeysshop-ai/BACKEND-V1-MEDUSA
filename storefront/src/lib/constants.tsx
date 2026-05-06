import React from "react"
import { CreditCard } from "@medusajs/icons"

import Ideal from "@modules/common/icons/ideal"
import Bancontact from "@modules/common/icons/bancontact"
import PayPal from "@modules/common/icons/paypal"
import Cryptomus from "@modules/common/icons/cryptomus"

/* Map of payment provider_id to their title and icon. Add in any payment providers you want to use. */
export const paymentInfoMap: Record<
  string,
  { title: string; icon: React.JSX.Element }
> = {
  pp_stripe_stripe: {
    title: "Credit card",
    icon: <CreditCard />,
  },
  "pp_medusa-payments_default": {
    title: "Credit card",
    icon: <CreditCard />,
  },
  "pp_stripe-ideal_stripe": {
    title: "iDeal",
    icon: <Ideal />,
  },
  "pp_stripe-bancontact_stripe": {
    title: "Bancontact",
    icon: <Bancontact />,
  },
  pp_paypal_paypal: {
    title: "PayPal",
    icon: <PayPal />,
  },
  pp_system_default: {
    title: "Manual Payment",
    icon: <CreditCard />,
  },
    pp_cryptomus_cryptomus: {
    title: "Criptomonedas",
    icon: <Cryptomus />,
  },
  pp_aurpay_aurpay: {
    title: "Aurpay (Crypto)",
    icon: <CreditCard />,
  },
}

export const isStripeLike = (providerId?: string) => {
  return (
    providerId?.startsWith("pp_stripe_") || providerId?.startsWith("pp_medusa-")
  )
}

export const isPaypal = (providerId?: string) => {
  return providerId?.startsWith("pp_paypal")
}

export const isManual = (providerId?: string) => {
  return providerId?.startsWith("pp_system_default")
}

export const isCryptomus = (providerId?: string) => {
  return providerId?.startsWith("pp_cryptomus")
}

export const isAurpay = (providerId?: string) => {
  return providerId?.startsWith("pp_aurpay")
}

export const noDivisionCurrencies = [
  "krw", "jpy", "vnd", "clp", "pyg", "xaf", "xof", "bif",
  "djf", "gnf", "kmf", "mga", "rwf", "xpf", "htg", "vuv",
  "xag", "xdr", "xau",
]
