import {
  PaymentProvider,
  PaymentData,
  PaymentIntent,
  PaymentStatus,
  ProviderId,
  MedusaContainer,
} from "@medusajs/framework";

export class BTCPayProviderService implements PaymentProvider {
  id: ProviderId = "btcpay";
  private container: MedusaContainer;

  constructor(container: MedusaContainer) {
    this.container = container;
  }

  async createPayment(data: PaymentData): Promise<PaymentIntent> {
    const { order_id, amount, currency_code } = data;
    const apiUrl = process.env.BTCPAY_URL || "https://mainnet.demo.btcpayserver.org";
    const apiKey = process.env.BTCPAY_API_KEY;
    const storeId = process.env.BTCPAY_STORE_ID;

    if (!apiKey || !storeId) throw new Error("BTCPay credentials missing");

    const payload = {
      price: Math.round(amount),
      currency: currency_code?.toUpperCase() || "USD",
      order_id: order_id,
      order_url: `${process.env.BACKEND_PUBLIC_URL}/store/orders/${order_id}`,
      redirect_url: `${process.env.BACKEND_PUBLIC_URL}/store/orders/${order_id}`,
      full_notify: true,
    };

    const res = await fetch(`${apiUrl}/api/v1/stores/${storeId}/invoices`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "BTCPAY-API-KEY": apiKey!,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`BTCPay Error: ${res.statusText}`);
    const invoice = await res.json();

    return {
      id: `btcpay-${invoice.id}`,
      amount: Math.round(amount),
      currency_code: currency_code || "USD",
      data: {
        invoiceId: invoice.id,
        invoiceUrl: invoice.checkoutUrl,
        status: "pending",
      },
    };
  }

  async retrievePayment(intent: PaymentIntent): Promise<PaymentIntent> {
    const invoiceId = intent.data?.invoiceId;
    if (!invoiceId) return intent;

    const apiUrl = process.env.BTCPAY_URL || "https://mainnet.demo.btcpayserver.org";
    const apiKey = process.env.BTCPAY_API_KEY;
    const storeId = process.env.BTCPAY_STORE_ID;

    const res = await fetch(`${apiUrl}/api/v1/stores/${storeId}/invoices/${invoiceId}`, {
      headers: { "BTCPAY-API-KEY": apiKey! },
    });
    if (!res.ok) return intent;

    const data = await res.json();
    let status: PaymentStatus = "pending";
    if (data.status === "confirmed" || data.status === "complete") status = "authorized";
    if (data.status === "invalid" || data.status === "expired") status = "failed";

    return { ...intent, status, data: { ...intent.data, status, paidAmount: data.paidAmount } };
  }

  async cancelPayment(_data: PaymentData, intent: PaymentIntent): Promise<PaymentIntent> {
    return { ...intent, status: "cancelled" };
  }

  async refundPayment(_data: PaymentData, _intent: PaymentIntent): Promise<{ status: "refunded" | "failed" }> {
    return { status: "refunded" };
  }

  async capturePayment(_data: PaymentData, intent: PaymentIntent): Promise<PaymentIntent> {
    return intent;
  }
}
