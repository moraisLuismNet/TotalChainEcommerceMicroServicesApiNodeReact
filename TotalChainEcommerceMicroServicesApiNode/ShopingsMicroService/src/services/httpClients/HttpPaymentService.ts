import { axios, getAuthHeaders } from "./HttpUtils";
import { CheckoutSessionResponseDTO } from "../../core/dtos/Payment/CheckoutSessionResponseDTO";

const paymentsApi = process.env.MICROSERVICES_PAYMENTS_API || "http://localhost:5004";

export class HttpPaymentService {
  static async createCheckoutSession(items: { name: string; quantity: number; price: number }[], customerEmail: string): Promise<CheckoutSessionResponseDTO | null> {
    try {
      const dto = {
        items,
        userEmail: customerEmail,
        successUrl: process.env.STRIPE_SUCCESS_URL || `http://localhost:5173/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: process.env.STRIPE_CANCEL_URL || `http://localhost:5173/payment/cancel`,
      };
      const response = await axios.post(`${paymentsApi}/api/payments/create-checkout-session`, dto, getAuthHeaders());
      return response.data?.data || response.data;
    } catch (error: any) {
      console.error(`[HttpPaymentService] Failed to create checkout session: ${error.message}`);
      return null;
    }
  }
}
