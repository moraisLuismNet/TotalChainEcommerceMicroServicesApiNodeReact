export interface StripeSessionResult {
  id: string;
  url: string | null;
  paymentIntentId: string | null;
  paymentStatus: string;
  amountTotal: number;
  currency: string;
  customerEmail: string | null;
}
export interface IStripeProvider {
  createCheckoutSession(items: { name: string; quantity: number; price: number }[], successUrl: string, cancelUrl: string, customerEmail?: string): Promise<StripeSessionResult>;
  retrieveSession(sessionId: string): Promise<StripeSessionResult>;
}
