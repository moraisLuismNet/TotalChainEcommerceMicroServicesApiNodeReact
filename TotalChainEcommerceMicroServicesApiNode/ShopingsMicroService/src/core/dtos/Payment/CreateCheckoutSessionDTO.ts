export interface CreateCheckoutSessionDTO {
  amount: number;
  currency: string;
  description: string;
  reference: string;
  customerEmail: string;
  source: "web" | "app";
  callbackUrl: string;
}
