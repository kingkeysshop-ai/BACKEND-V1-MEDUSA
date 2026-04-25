import { AbstractPaymentProvider } from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"

interface MedusaJsPaymentServiceOptions {
  api_key: string
}

export class MedusaJsPaymentService extends AbstractPaymentProvider<MedusaJsPaymentServiceOptions> {
  static identifier = "medusajs-payment"

  protected readonly options_: MedusaJsPaymentServiceOptions

  constructor(
    injectedDependencies: Record<string, unknown>,
    options: MedusaJsPaymentServiceOptions
  ) {
    super(injectedDependencies as any, options)
    this.options_ = options

    if (!this.options_.api_key) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "MedusaJS Payment requires api_key"
      )
    }
  }

  async initiatePayment(context: any): Promise<any> {
    return { id: `mps_${Date.now()}`, data: context }
  }

  async authorizePayment(paymentSessionData: any): Promise<any> {
    return { status: "authorized", data: paymentSessionData }
  }

  async capturePayment(paymentSessionData: any): Promise<any> {
    return paymentSessionData
  }

  async refundPayment(paymentSessionData: any, amount: number): Promise<any> {
    return { ...paymentSessionData, refunded_amount: amount }
  }

  async cancelPayment(paymentSessionData: any): Promise<any> {
    return paymentSessionData
  }

  async deletePayment(_paymentSessionData: any): Promise<void> {}

  async getPaymentStatus(_paymentSessionData: any): Promise<any> {
    return "authorized"
  }

  async retrievePayment(_paymentSessionData: any): Promise<any> {
    return {}
  }

  async updatePayment(context: any): Promise<any> {
    return context
  }
}
