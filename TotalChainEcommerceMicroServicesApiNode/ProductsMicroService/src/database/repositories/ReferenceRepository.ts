import { Reference } from "../models/Reference";
import { BaseRepository } from "./BaseRepository";
import { WhereOptions } from "sequelize";

export class ReferenceRepository extends BaseRepository<Reference> {
  constructor() { super(Reference); }

  async findBySubCategory(subCategoryId: string): Promise<Reference[]> {
    return this.model.findAll({ where: { SubCategoryId: subCategoryId } as WhereOptions });
  }
}
