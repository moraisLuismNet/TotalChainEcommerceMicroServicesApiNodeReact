import { Model, ModelStatic } from "sequelize";
import { IBaseRepository } from "./interfaces/IBaseRepository";
export class BaseRepository<T extends Model<T>> implements IBaseRepository<T> {
  protected model: ModelStatic<T>;
  constructor(model: ModelStatic<T>) { this.model = model; }
  async findById(id: number): Promise<T | null> { return this.model.findByPk(id); }
  async findAll(): Promise<T[]> { return this.model.findAll(); }
  async create(entity: Partial<T>): Promise<T> { return this.model.create(entity as any); }
  async update(id: number, entity: Partial<T>): Promise<T | null> { const item = await this.findById(id); if (!item) return null; await item.update(entity as any); return item; }
  async delete(id: number): Promise<boolean> { const item = await this.findById(id); if (!item) return false; await item.destroy(); return true; }
}
