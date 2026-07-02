import { CartDetail } from "../models/CartDetail";
import { BaseRepository } from "./BaseRepository";

export class CartDetailRepository extends BaseRepository<CartDetail> {
  constructor() { super(CartDetail); }

  async getByCartId(cartId: number): Promise<CartDetail[]> {
    return this.findAll({ where: { CartId: cartId } });
  }

  async getByCartAndProduct(cartId: number, productId: string): Promise<CartDetail | null> {
    return this.findOne({ where: { CartId: cartId, ProductId: CartDetail.sequelize?.literal ? productId : productId } });
  }

  async deleteByCartId(cartId: number): Promise<boolean> {
    const deleted = await this.model.destroy({ where: { CartId: cartId } });
    return deleted > 0;
  }
}
