import { Stock } from "../models/Stock";
import { BaseRepository } from "./BaseRepository";

export class StockRepository extends BaseRepository<Stock> {
  constructor() { super(Stock); }

  async findByProductId(productId: string): Promise<Stock[]> {
    return await this.findAll({ where: { ProductId: productId } });
  }
}
