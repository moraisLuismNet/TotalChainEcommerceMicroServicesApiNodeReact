import { Category } from "../models/Category";
import { BaseRepository } from "./BaseRepository";

export class CategoryRepository extends BaseRepository<Category> {
  constructor() { super(Category); }
}
