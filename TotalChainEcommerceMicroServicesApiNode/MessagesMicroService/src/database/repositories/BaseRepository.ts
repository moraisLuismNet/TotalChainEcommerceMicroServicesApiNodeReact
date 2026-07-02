import { Model, ModelStatic } from "sequelize";
import { IBaseRepository } from "./interfaces/IBaseRepository";

export class BaseRepository<T extends Model> implements IBaseRepository<T> {
  protected model: ModelStatic<T>;

  constructor(model: ModelStatic<T>) {
    this.model = model;
  }

  async getAll(): Promise<T[]> {
    return this.model.findAll();
  }

  async getById(id: number): Promise<T | null> {
    return this.model.findByPk(id);
  }

  async create(data: any): Promise<T> {
    return this.model.create(data);
  }

  async update(id: number, data: any): Promise<T | null> {
    const record = await this.getById(id);
    if (!record) return null;
    await record.update(data);
    return record;
  }

  async delete(id: number): Promise<boolean> {
    const record = await this.getById(id);
    if (!record) return false;
    await record.destroy();
    return true;
  }
}
