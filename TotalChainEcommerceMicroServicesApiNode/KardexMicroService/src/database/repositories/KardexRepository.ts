import Kardex from "../models/Kardex";
import { BaseRepository } from "./BaseRepository";
import { IKardexRepository } from "./interfaces/IKardexRepository";
export class KardexRepository extends BaseRepository<Kardex> implements IKardexRepository {
  constructor() { super(Kardex); }
  async findByProductId(productId: string): Promise<Kardex[]> {
    return Kardex.findAll({ where: { ProductId: productId }, order: [["Date", "DESC"]] });
  }
}
