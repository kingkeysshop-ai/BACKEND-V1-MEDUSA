import { AbstractPaymentProvider } from "@medusajs/framework/utils";
import crypto from "crypto";

interface AuthorizeNetOptions {
  login_id: string;
  transaction_key: string;
  public_client_key?: string;
  environment?: "sandbox" | "production";
  webhook_secret?: string;
}

class AuthorizeNetPaymentService extends AbstractPaymentProvider<AuthorizeNetOptions> {
  static identifier = "authorizenet";

  protected logger_: any;
  protected options_: AuthorizeNetOptions;

  constructor(container: any, options: AuthorizeNetOptions) {
    super(container, options);
    this.options_ = options;
    this.logger_ = container.logger;
  }

  async initiatePayment(input: any): Promise<any> {
    try {
      const { amount, currency, customer, context, order_id } = input;

      const response = await this.callAuthorizeNetAPI("createTransactionRequest", {
        transactionRequest: {
          transactionType: "authOnlyTransaction",
          amount: (amount / 100).toFixed(2),
          currency,
          customer: {
            id: customer?.id || "",
            email: customer?.email || "",
          },
          order: {
            invoiceNumber: order_id || "",
          },
          payment: {
            creditCard: {
              cardNumber: "4111111111111111",
              expirationDate: "1225",
              cardCode: "123",
            },
          },
        },
      });

      return {
        session_id: response.transactionResponse?.transId || "",
        status: "pending",
        data: response,
      };
    } catch (error) {
      this.logger_.error(`Authorize.net initiatePayment error: ${error}`);
      throw error;
    }
  }

  async deletePayment(input: any): Promise<any> {
    try {
      const { session_id } = input;

      await this.callAuthorizeNetAPI("createTransactionRequest", {
        transactionRequest: {
          transactionType: "voidTransaction",
          refTransId: session_id,
        },
      });

      return {
        session_id,
        status: "canceled",
      };
    } catch (error) {
      this.logger_.error(`Authorize.net deletePayment error: ${error}`);
      throw error;
    }
  }

  async retrievePayment(input: any): Promise<any> {
    try {
      const { session_id } = input;

      const response = await this.callAuthorizeNetAPI("getTransactionDetailsRequest", {
        transId: session_id,
      });

      return {
        session_id,
        status: response.transaction?.transactionStatus || "pending",
        data: response,
      };
    } catch (error) {
      this.logger_.error(`Authorize.net retrievePayment error: ${error}`);
      return {
        session_id: input.session_id,
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async updatePayment(input: any): Promise<any> {
    try {
      const { session_id, amount } = input;

      return {
        session_id,
        status: "updated",
        data: { amount },
      };
    } catch (error) {
      this.logger_.error(`Authorize.net updatePayment error: ${error}`);
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

      const response = await this.callAuthorizeNetAPI("getTransactionDetailsRequest", {
        transId: session_id,
      });

      return {
        status: response.transaction?.transactionStatus || "pending",
        data: response,
      };
    } catch (error) {
      this.logger_.error(`Authorize.net getPaymentStatus error: ${error}`);
      return {
        status: "error",
        data: { error: error instanceof Error ? error.message : "Unknown error" },
      };
    }
  }

  async authorizePayment(input: any): Promise<any> {
    try {
      const { session_id } = input;

      const response = await this.callAuthorizeNetAPI("createTransactionRequest", {
        transactionRequest: {
          transactionType: "authOnlyTransaction",
          refTransId: session_id,
        },
      });

      return {
        status: "authorized",
        data: response,
      };
    } catch (error) {
      this.logger_.error(`Authorize.net authorizePayment error: ${error}`);
      throw error;
    }
  }

  async capturePayment(input: any): Promise<any> {
    try {
      const { session_id } = input;

      const response = await this.callAuthorizeNetAPI("createTransactionRequest", {
        transactionRequest: {
          transactionType: "priorAuthCaptureTransaction",
          refTransId: session_id,
        },
      });

      return {
        status: "captured",
        data: response,
      };
    } catch (error) {
      this.logger_.error(`Authorize.net capturePayment error: ${error}`);
      throw error;
    }
  }

  async refundPayment(input: any): Promise<any> {
    try {
      const { session_id, amount } = input;

      const response = await this.callAuthorizeNetAPI("createTransactionRequest", {
        transactionRequest: {
          transactionType: "refundTransaction",
          refTransId: session_id,
          amount: amount ? (amount / 100).toFixed(2) : undefined,
        },
      });

      return {
        status: "refunded",
        data: response,
      };
    } catch (error) {
      this.logger_.error(`Authorize.net refundPayment error: ${error}`);
      throw error;
    }
  }

  async cancelPayment(input: any): Promise<any> {
    try {
      const { session_id } = input;

      const response = await this.callAuthorizeNetAPI("createTransactionRequest", {
        transactionRequest: {
          transactionType: "voidTransaction",
          refTransId: session_id,
        },
      });

      return {
        status: "canceled",
        data: response,
      };
    } catch (error) {
      this.logger_.error(`Authorize.net cancelPayment error: ${error}`);
      throw error;
    }
  }

  async getWebhookActionAndData(input: any): Promise<any> {
    try {
      const { body, headers } = input;

      if (this.options_.webhook_secret) {
        this.validateWebhookSignature(body, headers);
      }

      const { eventType, data } = body;

      let action = "not_actionable";
      if (eventType === "net.authorize.payment.authcapture.created") {
        action = "captured";
      } else if (eventType === "net.authorize.payment.authonly.created") {
        action = "authorized";
      } else if (eventType === "net.authorize.payment.refund.created") {
        action = "refunded";
      } else if (eventType === "net.authorize.payment.void.created") {
        action = "canceled";
      }

      return {
        action,
        data,
      };
    } catch (error) {
      this.logger_.error(`Authorize.net getWebhookActionAndData error: ${error}`);
      return {
        action: "not_actionable",
        data: null,
      };
    }
  }

  private async callAuthorizeNetAPI(
    endpoint: string,
    payload: Record<string, any>
  ): Promise<any> {
    const environment = this.options_.environment || "sandbox";
    const baseUrl =
      environment === "production"
        ? "https://api.authorize.net/xml/v1/request.api"
        : "https://apitest.authorize.net/xml/v1/request.api";

    const xmlPayload = this.buildXmlPayload(endpoint, payload);

    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/xml",
      },
      body: xmlPayload,
    });

    if (!response.ok) {
      throw new Error(
        `Authorize.net API error: ${response.status} ${response.statusText}`
      );
    }

    const text = await response.text();
    return this.parseXmlResponse(text);
  }

  private buildXmlPayload(endpoint: string, data: Record<string, any>): string {
    const loginId = this.options_.login_id;
    const transactionKey = this.options_.transaction_key;

    let xml = `<?xml version="1.0" encoding="utf-8"?>
      <createTransactionRequest xmlns="AnetApi/xml/v1/schema/AnetApiSchema.xsd">
        <merchantAuthentication>
          <name>${loginId}</name>
          <transactionKey>${transactionKey}</transactionKey>
        </merchantAuthentication>`;

    if (data.transactionRequest) {
      xml += `<transactionRequest>
        <transactionType>${data.transactionRequest.transactionType}</transactionType>
        <amount>${data.transactionRequest.amount || ""}</amount>
        ${data.transactionRequest.refTransId ? `<refTransId>${data.transactionRequest.refTransId}</refTransId>` : ""}
      </transactionRequest>`;
    }

    xml += `</createTransactionRequest>`;

    return xml;
  }

  private parseXmlResponse(xml: string): any {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xml, "text/xml");

      return {
        transactionResponse: {
          transId: doc.querySelector("transId")?.textContent || "",
          responseCode: doc.querySelector("responseCode")?.textContent || "",
          resultCode: doc.querySelector("resultCode")?.textContent || "",
        },
        transaction: {
          transactionStatus:
            doc.querySelector("transactionStatus")?.textContent || "pending",
        },
      };
    } catch (error) {
      this.logger_.error(`Error parsing XML response: ${error}`);
      return {};
    }
  }

  private validateWebhookSignature(
    body: Record<string, any>,
    headers: Record<string, any>
  ): void {
    const signature = headers["x-authorize-signature"] as string;
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

export default AuthorizeNetPaymentService;