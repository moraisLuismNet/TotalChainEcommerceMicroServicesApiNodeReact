export interface CartCheckoutDTO {
  userEmail: string;
  cartId: number;
  paymentMethod?: string;
}
