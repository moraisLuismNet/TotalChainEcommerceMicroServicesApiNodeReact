export interface CreateOrderDTO {
  userEmail: string;
  cartId: number;
  total: number;
  paymentMethod: string;
}
