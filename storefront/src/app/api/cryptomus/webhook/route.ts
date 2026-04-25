import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

const CRYPTOMUS_PAYMENT_KEY = process.env.CRYPTOMUS_PAYMENT_KEY!
const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL!
const MEDUSA_API_KEY = process.env.MEDUSA_API_KEY!

function verifyWebhookSign(
  body: Record<string, unknown>,
  receivedSign: string,
  apiKey: string
): boolean {
  const bodyCopy = { ...body }
  delete bodyCopy.sign

  const jsonStr = JSON.stringify(bodyCopy)
  const base64 = Buffer.from(jsonStr).toString("base64")
  const expectedSign = crypto
    .createHash("md5")
    .update(base64 + apiKey)
    .digest("hex")

  return expectedSign === receivedSign
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { sign, status, order_id, additional_data } = body

    // 1. Verify signature
    if (!sign || !verifyWebhookSign(body, sign, CRYPTOMUS_PAYMENT_KEY)) {
      console.warn("[Cryptomus Webhook] Invalid signature")
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    console.log(`[Cryptomus Webhook] Payment status: ${status} | Order: ${order_id}`)

    // 2. Only process confirmed/paid statuses
    const paidStatuses = ["paid", "paid_over", "wrong_amount_waiting", "confirm_check"]
    if (!paidStatuses.includes(status)) {
      return NextResponse.json({ received: true, status })
    }

    // 3. Complete the cart / place the order in Medusa
    // additional_data holds the cartId set during invoice creation
    const cartId = additional_data
    if (!cartId) {
      console.error("[Cryptomus Webhook] No cartId in additional_data")
      return NextResponse.json({ error: "Missing cartId" }, { status: 400 })
    }

    const medusaRes = await fetch(
      `${MEDUSA_BACKEND_URL}/store/carts/${cartId}/complete`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": MEDUSA_API_KEY,
        },
      }
    )

    const medusaData = await medusaRes.json()

    if (!medusaRes.ok) {
      console.error("[Cryptomus Webhook] Failed to complete cart:", medusaData)
      return NextResponse.json(
        { error: "Failed to complete Medusa order" },
        { status: 500 }
      )
    }

    console.log(
      `[Cryptomus Webhook] Order placed successfully: ${medusaData?.order?.id}`
    )

    return NextResponse.json({ received: true, orderId: medusaData?.order?.id })
  } catch (err: any) {
    console.error("[Cryptomus Webhook] Error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
