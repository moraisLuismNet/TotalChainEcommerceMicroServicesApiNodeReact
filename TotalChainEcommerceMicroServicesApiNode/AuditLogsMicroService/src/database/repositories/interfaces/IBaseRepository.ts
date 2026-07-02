import { Model } from "sequelize";

export interface IBaseRepository<T extends Model> {
  getAll(): Promise<T[]>;
  getById(id: number): Promise<T | null>;
  create(data: any): Promise<T>;
  update(id: number, data: any): Promise<T | null>;
  delete(id: number): Promise<boolean>;
}
