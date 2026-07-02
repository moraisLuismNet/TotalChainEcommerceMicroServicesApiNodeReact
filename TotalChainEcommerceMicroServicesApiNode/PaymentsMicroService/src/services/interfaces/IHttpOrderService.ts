export interface IHttpOrderService {
  createOrder(orderData: any): Promise<any>;
  updateOrderStatus(orderId: number, status: string): Promise<any>;
}
