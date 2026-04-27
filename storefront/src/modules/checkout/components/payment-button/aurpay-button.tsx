"use client"

import { placeOrder } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import React, { useState, useEffect } from "react"
import ErrorMessage from "../error-message"

type AurpayPaymentButtonProps = {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}

const AurpayPaymentButton: React.FC<AurpayPaymentButtonProps> = ({
  cart,
  notReady,
  "data-testid": dataTestId,
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const aurpayToken = process.env.NEXT_PUBLIC_AURPAY_TOKEN || "pb_plugin_code_token_rIFrCPy0e4JrPzjt"

  useEffect(() => {
    // Load Aurpay script
    const script = document.createElement("script")
    script.src = "https://pb.aurpay.net/pb/page/js/paymentbutton.js"
    script.setAttribute("data-payment_button_token", aurpayToken)
    script.async = true
    document.body.appendChild(script)

    return () => {
      // Cleanup script on unmount
      document.body.removeChild(script)
    }
  }, [aurpayToken])

  const handlePayment = async () => {
    if (submitting) return
    setSubmitting(true)
    
    try {
      await placeOrder()
    } catch (err: any) {
      setErrorMessage(err.message)
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <form id="aurpay_pb_code" className="w-full flex justify-center" onClick={handlePayment}>
        <a 
          href={`https://pb.aurpay.net/pb/page/html/paymentbutton.html?token=${aurpayToken}`}
          style={{ textDecoration: "none", width: "100%", display: "flex", justifyContent: "center" }}
          onClick={(e) => {
            if (notReady || submitting) {
              e.preventDefault()
            }
          }}
        >
          <button 
            type="button" 
            disabled={notReady || submitting}
            style={{ 
              boxShadow: "0 5px 30px 2px rgb(0 0 0 / 0.06), 0 3px 15px -4px rgb(0 0 0 / 0.06)", 
              cursor: notReady || submitting ? "not-allowed" : "pointer", 
              height: "54px", 
              paddingLeft: "20px", 
              boxSizing: "border-box", 
              border: "none", 
              outline: "none", 
              background: "#23275D", 
              borderRadius: "5px", 
              display: "flex", 
              alignItems: "center", 
              overflow: "hidden",
              opacity: notReady || submitting ? 0.5 : 1,
              width: "100%",
              justifyContent: "center",
              maxWidth: "400px"
            }}
          >
            {submitting ? (
              <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <img style={{ width: "24px", height: "24px" }} src="https://aurpay.net/wp-content/uploads/2022/06/favicon-logo.png" alt="logo" />
            )}
            <span style={{ 
              display: "block", 
              height: "54px", 
              backgroundColor: "#191D48", 
              padding: "12px 20px", 
              boxSizing: "border-box", 
              transform: "skewX(-15deg) translateX(0.875rem)", 
              textAlign: "center",
              flex: 1
            }}>
              <span style={{ display: "block", color: "#FFFFFF", fontSize: "14px", marginBottom: "4px", transform: "skewX(8deg)", fontWeight: 700 }}>
                {submitting ? "Procesando..." : "Pay with Aurpay"}
              </span>
              <span style={{ display: "block", fontSize: "10px", color: "#FFFFFF", opacity: 0.5, transform: "skewX(6deg)" }}>
                Secured by Aurpay
              </span>
            </span>
          </button>
        </a>
      </form>
      <ErrorMessage error={errorMessage} data-testid="aurpay-payment-error-message" />
    </div>
  )
}

export default AurpayPaymentButton
