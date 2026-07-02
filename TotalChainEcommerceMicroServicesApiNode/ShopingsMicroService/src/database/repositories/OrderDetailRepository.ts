import { OrderDetail } from "../models/OrderDetail";
import { BaseRepository } from "./BaseRepository";

export class OrderDetailRepository extends BaseRepository<OrderDetail> {
  constructor() { super(OrderDetail); }

  async getByOrderId(orderId: number): Promise<OrderDetail[]> {
    return this.findAll({ where: { OrderId: orderId } });
  }
}
