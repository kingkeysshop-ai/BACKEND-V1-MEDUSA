import { AbstractPaymentProvider } from "@medusajs/framework/utils";
import crypto from "crypto";

interface AurpayOptions {
  api_key: string;
  environment?: "production" | "sandbox";
  webhook_secret?: string;
}

class AurpayPaymentService extends AbstractPaymentProvider<AurpayOptions> {
  static identifier = "aurpay";

  protected logger_: any;
  protected options_: AurpayOptions;

  constructor(container: any, options: AurpayOptions) {
    super(container, options);
    this.options_ = options;
    this.logger_ = container.logger;
  
  }

  async initiatePayment(input: any): Promise<any> {
    try {
      const { amount, currency, customer, context, order_id } = input;

      const response = await this.callAurpayAPI("POST", "/v1/orders", {
        amount,
        currency,
        customer_id: customer?.id,
        order_id,
        metadata: context,
      });

      return {
        session_id: response.id,
        client_token: response.client_token,
        status: "pending",
        data: response,
      };
    } catch (error) {
      this.logger_.error(`Aurpay initiatePayment error: ${error}`);
      throw error;
    }
  }

  async deletePayment(input: any): Promise<any> {
    try {
      const { session_id } = input;

      await this.callAurpayAPI("DELETE", `/v1/orders/${session_id}`, {});

      return {
        session_id,
        status: "canceled",
      };
    } catch (error) {
      this.logger_.error(`Aurpay deletePayment error: ${error}`);
      throw error;
    }
  }

  async retrievePayment(input: any): Promise<any> {
    try {
      const { session_id } = input;

      const response = await this.callAurpayAPI("GET", `/v1/orders/${session_id}`);

      return {
        session_id,
        status: response.status || "pending",
        data: response,
      };
    } catch (error) {
      this.logger_.error(`Aurpay retrievePayment error: ${error}`);
      return {
        session_id: input.session_id,
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async updatePayment(input: any): Promise<any> {
    try {
      const { session_id, amount, currency } = input;

      const response = await this.callAurpayAPI("PATCH", `/v1/orders/${session_id}`, {
        amount,
        currency,
      });

      return {
        session_id,
        status: "updated",
        data: response,
      };
    } catch (error) {
      this.logger_.error(`Aurpay updatePayment error: ${error}`);
      throw error;
    }
  }

  async createPaymentSession(input: any): Promise<any> {
    return this.initiatePayment(input);
  }

  async getPaymentStatus(input: any): Promise<any> {
    try {
      const { session_id } = input;

      if (!session_id) {
        return { status: "pending" };
      }

      const sessionData = await this.callAurpayAPI("GET", `/v1/orders/${session_id}`);

      return {
        status: sessionData.status || "pending",
        data: sessionData,
      };
    } catch (error) {
      this.logger_.error(`Aurpay getPaymentStatus error: ${error}`);
      return { status: "error", data: { error: error instanceof Error ? error.message : "Unknown error" } };
    }
  }

  async authorizePayment(input: any): Promise<any> {
    try {
      const { session_id, payment_method } = input;

      const response = await this.callAurpayAPI("POST", `/v1/orders/${session_id}/authorize`, {
        payment_method,
      });

      return {
        status: "authorized",
        data: response,
      };
    } catch (error) {
      this.logger_.error(`Aurpay authorizePayment error: ${error}`);
      throw error;
    }
  }

  async capturePayment(input: any): Promise<any> {
    try {
      const { session_id } = input;

      const response = await this.callAurpayAPI("POST", `/v1/orders/${session_id}/capture`, {});

      return {
        status: "captured",
        data: response,
      };
    } catch (error) {
      this.logger_.error(`Aurpay capturePayment error: ${error}`);
      throw error;
    }
  }

  async refundPayment(input: any): Promise<any> {
    try {
      const { session_id, amount } = input;

      const response = await this.callAurpayAPI("POST", `/v1/orders/${session_id}/refund`, {
        amount,
      });

      return {
        status: "refunded",
        data: response,
      };
    } catch (error) {
      this.logger_.error(`Aurpay refundPayment error: ${error}`);
      throw error;
    }
  }

  async cancelPayment(input: any): Promise<any> {
    try {
      const { session_id } = input;

      const response = await this.callAurpayAPI("POST", `/v1/orders/${session_id}/cancel`, {});

      return {
        status: "canceled",
        data: response,
      };
    } catch (error) {
      this.logger_.error(`Aurpay cancelPayment error: ${error}`);
      throw error;
    }
  }

  async getWebhookActionAndData(input: any): Promise<any> {
    try {
      const { body, headers } = input;

      if (this.options_.webhook_secret) {
        this.validateWebhookSignature(body, headers);
      }

      const { event_type, data } = body;

      let action = "not_actionable";
      if (event_type === "payment.authorized") {
        action = "authorized";
      } else if (event_type === "payment.captured") {
        action = "captured";
      } else if (event_type === "payment.refunded") {
        action = "refunded";
      } else if (event_type === "payment.canceled") {
        action = "canceled";
      }

      return {
        action,
        data,
      };
    } catch (error) {
      this.logger_.error(`Aurpay getWebhookActionAndData error: ${error}`);
      return {
        action: "not_actionable",
        data: null,
      };
    }
  }

  private async callAurpayAPI(
    method: string,
    endpoint: string,
    payload?: Record<string, any>
  ): Promise<any> {
    const apiKey = this.options_.api_key;
    const environment = this.options_.environment || "production";
    const baseUrl =
      environment === "production"
        ? "https://api.aurpay.com"
        : "https://sandbox-api.aurpay.com";

    const url = `${baseUrl}${endpoint}`;

    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    };

    if (payload) {
      options.body = JSON.stringify(payload);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Aurpay API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  private validateWebhookSignature(body: Record<string, any>, headers: Record<string, any>): void {
    const signature = headers["x-aurpay-signature"] as string;
    const webhookSecret = this.options_.webhook_secret;

    if (!signature || !webhookSecret) {
      throw new Error("Missing webhook signature or secret");
    }

    const payload = JSON.stringify(body);
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(payload)
      .digest("hex");

    if (signature !== expectedSignature) {
      throw new Error("Invalid webhook signature");
    }
  }
}

export default AurpayPaymentService;