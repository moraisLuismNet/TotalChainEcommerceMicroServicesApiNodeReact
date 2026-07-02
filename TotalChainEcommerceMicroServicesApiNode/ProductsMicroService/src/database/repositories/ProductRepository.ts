import { Product } from "../models/Product";
import { BaseRepository } from "./BaseRepository";
import { Reference } from "../models/Reference";
import { Stock } from "../models/Stock";

const PRODUCT_INCLUDE = [
  { model: Reference, as: 'Reference' },
  { model: Stock, as: 'Stocks' },
];

export class ProductRepository extends BaseRepository<Product> {
  constructor() { super(Product); }

  async findByReferenceId(referenceId: string): Promise<Product[]> {
    return await this.findAll({ where: { ReferenceId: referenceId }, include: PRODUCT_INCLUDE });
  }

  async searchByName(text: string): Promise<Product[]> {
    return await this.findAll({
      where: { Name: { [this.constructor.name ? ({} as any) : 'like']: `%${text}%` } },
      include: PRODUCT_INCLUDE,
    });
  }
}
