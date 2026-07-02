import { StockRepository } from "../database/repositories/StockRepository";
import { StockDTO } from "../core/dtos/Stock/StockDTO";
import { CreateStockDTO } from "../core/dtos/Stock/CreateStockDTO";

export class StockService {
  private repository: StockRepository;

  constructor() { this.repository = new StockRepository(); }

  async getAllAsync(): Promise<StockDTO[]> {
    const items = await this.repository.getAll();
    return items.map(this.toDTO);
  }

  async getByIdAsync(id: string): Promise<StockDTO | null> {
    const item = await this.repository.getById(id);
    return item ? this.toDTO(item) : null;
  }

  async getByProductIdAsync(productId: string): Promise<StockDTO[]> {
    const items = await this.repository.findByProductId(productId);
    return items.map(this.toDTO);
  }

  async createAsync(dto: CreateStockDTO): Promise<StockDTO> {
    const item = await this.repository.create(dto);
    return this.toDTO(item);
  }

  async updateAsync(id: string, updatedBy: string, quantity: number): Promise<StockDTO> {
    const item = await this.repository.update(id, { Quantity: quantity, UpdatedBy: updatedBy } as any);
    return this.toDTO(item);
  }

  async deleteAsync(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }

  private toDTO(c: any): StockDTO {
    return { id: c.Id, productId: c.ProductId, quantity: c.Quantity, warehouse: c.Warehouse, createdBy: c.CreatedBy, updatedBy: c.UpdatedBy };
  }
}
