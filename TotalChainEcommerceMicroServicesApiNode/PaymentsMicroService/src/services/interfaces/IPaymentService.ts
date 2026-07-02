import { CreateCheckoutSessionDTO } from "../../core/dtos/Payment/CreateCheckoutSessionDTO";
import { CheckoutSessionResponseDTO } from "../../core/dtos/Payment/CheckoutSessionResponseDTO";
import { ConfirmPaymentDTO } from "../../core/dtos/Payment/ConfirmPaymentDTO";
import Payment from "../../database/models/Payment";
export interface IPaymentService {
  createCheckoutSession(dto: CreateCheckoutSessionDTO, userEmail: string): Promise<CheckoutSessionResponseDTO>;
  confirmPayment(dto: ConfirmPaymentDTO, userEmail: string): Promise<Payment>;
  handleStripeWebhook(body: any, signature: string): Promise<void>;
  getPaymentBySessionId(sessionId: string): Promise<Payment | null>;
}
