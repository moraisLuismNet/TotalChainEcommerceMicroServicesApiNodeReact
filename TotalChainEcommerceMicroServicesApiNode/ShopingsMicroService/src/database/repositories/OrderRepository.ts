import { Order } from "../models/Order";
import { BaseRepository } from "./BaseRepository";

export class OrderRepository extends BaseRepository<Order> {
  constructor() { super(Order); }

  async getByUserEmail(userEmail: string): Promise<Order[]> {
    return this.findAll({ where: { UserEmail: userEmail } });
  }
}
