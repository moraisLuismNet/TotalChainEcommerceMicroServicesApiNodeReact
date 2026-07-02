import Kardex from "../../models/Kardex";
import { IBaseRepository } from "./IBaseRepository";
export interface IKardexRepository extends IBaseRepository<Kardex> {
  findByProductId(productId: string): Promise<Kardex[]>;
}
