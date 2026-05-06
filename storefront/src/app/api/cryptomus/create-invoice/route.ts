import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

const CRYPTOMUS_MERCHANT_ID = process.env.CRYPTOMUS_MERCHANT_ID!
const CRYPTOMUS_PAYMENT_KEY = process.env.CRYPTOMUS_PAYMENT_KEY!
const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!

function generateSign(data: Record<string, unknown>, apiKey: string): string {
  const jsonStr = JSON.stringify(data)
  const base64 = Buffer.from(jsonStr).toString("base64")
  return crypto.createHash("md5").update(base64 + apiKey).digest("hex")
}

export async function POST(req: NextRequest) {
  try {
    const { amount, currency, orderId, cartId } = await req.json()

    if (!amount || !currency || !orderId || !cartId) {
      return NextResponse.json(
        { error: "Missing required fields: amount, currency, orderId, cartId" },
        { status: 400 }
      )
    }

    const payload: Record<string, unknown> = {
      merchant_id: CRYPTOMUS_MERCHANT_ID,
      amount: String(amount),
      currency: currency.toUpperCase(),
      order_id: orderId,
      url_return: `${NEXT_PUBLIC_BASE_URL}/checkout?step=review&cryptomus=return`,
      url_success: `${NEXT_PUBLIC_BASE_URL}/order/${orderId}/confirmed`,
      url_callback: `${NEXT_PUBLIC_BASE_URL}/api/cryptomus/webhook`,
      is_payment_multiple: false,
      lifetime: 3600,
      additional_data: cartId,
    }

    const sign = generateSign(payload, CRYPTOMUS_PAYMENT_KEY)

    const response = await fetch("https://api.cryptomus.com/v1/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        merchant: CRYPTOMUS_MERCHANT_ID,
        sign,
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok || data.state !== 0) {
      console.error("[Cryptomus] Error creating invoice:", data)
      return NextResponse.json(
        { error: data.message || "Failed to create Cryptomus invoice" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      url: data.result.url,
      uuid: data.result.uuid,
      orderId: data.result.order_id,
    })
  } catch (err: any) {
    console.error("[Cryptomus] Unexpected error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
