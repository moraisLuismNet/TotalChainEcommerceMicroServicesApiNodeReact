import { SubCategory } from "../models/SubCategory";
import { BaseRepository } from "./BaseRepository";
import { WhereOptions } from "sequelize";

export class SubCategoryRepository extends BaseRepository<SubCategory> {
  constructor() { super(SubCategory); }

  async findByCategory(categoryId: string): Promise<SubCategory[]> {
    return this.model.findAll({ where: { CategoryId: categoryId } as WhereOptions });
  }
}
