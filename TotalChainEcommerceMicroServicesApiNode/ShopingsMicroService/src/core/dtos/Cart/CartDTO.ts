export interface CartDTO {
  idCart: number;
  userEmail: string;
  totalPrice: number;
  enabled: boolean;
  createdAt?: string;
  updatedAt?: string;
  details?: CartDetailItemDTO[];
}

export interface CartDetailItemDTO {
  idCartDetail: number;
  cartId: number;
  productId: string;
  productName?: string;
  unitPrice?: number;
  amount: number;
  price: number;
}
