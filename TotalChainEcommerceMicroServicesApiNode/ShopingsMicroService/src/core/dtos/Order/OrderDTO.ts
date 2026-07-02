export interface OrderDTO {
  idOrder: number;
  orderDate: string;
  paymentMethod: string;
  total: number;
  userEmail: string;
  cartId: number;
  status: string;
  details?: OrderDetailDTO[];
}

export interface OrderDetailDTO {
  idOrderDetail: number;
  orderId: number;
  productId: string;
  amount: number;
  price: number;
  total: number;
}
