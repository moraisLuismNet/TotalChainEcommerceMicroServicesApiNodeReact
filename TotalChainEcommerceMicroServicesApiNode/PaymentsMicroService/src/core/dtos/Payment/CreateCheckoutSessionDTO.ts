export interface CreateCheckoutSessionDTO {
  items: CheckoutItem[];
  successUrl?: string;
  cancelUrl?: string;
}
export interface CheckoutItem {
  name: string;
  quantity: number;
  price: number;
}
