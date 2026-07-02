import { Cart } from "../models/Cart";
import { BaseRepository } from "./BaseRepository";

export class CartRepository extends BaseRepository<Cart> {
  constructor() { super(Cart); }

  async getByUserEmail(userEmail: string): Promise<Cart | null> {
    return this.findOne({ where: { UserEmail: userEmail } });
  }

  async getActiveCartByUser(userEmail: string): Promise<Cart | null> {
    return this.findOne({ where: { UserEmail: userEmail, Enabled: true } });
  }
}
