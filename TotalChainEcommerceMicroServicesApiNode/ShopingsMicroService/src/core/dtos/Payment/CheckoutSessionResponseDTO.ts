export interface CheckoutSessionResponseDTO {
  sessionId: string;
  url: string;
  redirectUrl?: string;
  status: string;
}
