import {
  AbstractPaymentProcessorService,
  PaymentSessionStatus,
  CreatePaymentInput,
  PaymentSession,
} from "@medusajs/payment"
import { Logger } from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"

interface MedusaJsPaymentServiceOptions {
  api_key: string
}

export class MedusaJsPaymentService extends AbstractPaymentProcessorService<MedusaJsPaymentServiceOptions> {
  static identifier = "medusajs-payment"

  protected readonly options_: MedusaJsPaymentServiceOptions
  protected logger_: Logger

  constructor(
    injectedDependencies: { logger: Logger },
    options: MedusaJsPaymentServiceOptions
  ) {
    super(options)
    this.logger_ = injectedDependencies.logger
    this.options_ = options

    if (!this.options_.api_key) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "MedusaJS Payment requires api_key"
      )
    }
  }

  async createPayment(input: CreatePaymentInput): Promise<PaymentSession> {
    this.logger_.info(`MedusaJS Payment: Creating payment for amount ${input.amount}`)

    return {
      id: `mps_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount: input.amount,
      status: PaymentSessionStatus.AUTHORIZED,
      provider_metadata: {},
      metadata: input.metadata ?? {},
    }
  }

  async authorize(paymentSession: PaymentSession, _context: Record<string, unknown> = {}): Promise<void> {
    this.logger_.info(`MedusaJS Payment: Authorizing payment ${paymentSession.id}`)
    // Mock success - in real impl, call API
  }

  async capture(paymentSession: PaymentSession, _context: Record<string, unknown> = {}): Promise<void> {
    this.logger_.info(`MedusaJS Payment: Capturing payment ${paymentSession.id}`)
    // Mock success
  }

  async getPaymentStatus(paymentSession: PaymentSession): Promise<PaymentSessionStatus> {
    this.logger_.info(`MedusaJS Payment: Getting status for payment ${paymentSession.id}`)
    return PaymentSessionStatus.AUTHORIZED
  }

  async refund(paymentSession: PaymentSession, amount: number, _context: Record<string, unknown> = {}): Promise<void> {
    this.logger_.info(`MedusaJS Payment: Refunding ${amount} for payment ${paymentSession.id}`)
    // Mock success
  }

  async voidPayment(paymentSession: PaymentSession, _context: Record<string, unknown> = {}): Promise<void> {
    this.logger_.info(`MedusaJS Payment: Voiding payment ${paymentSession.id}`)
    // Mock success
  }
}
