import { ProductRepository } from "../database/repositories/ProductRepository";
import { ProductDTO } from "../core/dtos/Product/ProductDTO";
import { CreateProductDTO } from "../core/dtos/Product/CreateProductDTO";
import { UpdateProductDTO } from "../core/dtos/Product/UpdateProductDTO";
import { Reference } from "../database/models/Reference";
import { Stock } from "../database/models/Stock";

const PRODUCT_INCLUDE = [
  { model: Reference, as: 'Reference' },
  { model: Stock, as: 'Stocks' },
];

export class ProductService {
  private repository: ProductRepository;

  constructor() { this.repository = new ProductRepository(); }

  async getAllAsync(): Promise<ProductDTO[]> {
    const items = await this.repository.getAll({ include: PRODUCT_INCLUDE });
    return items.map(this.toDTO);
  }

  async getByIdAsync(id: string): Promise<ProductDTO | null> {
    const item = await this.repository.getById(id, { include: PRODUCT_INCLUDE });
    return item ? this.toDTO(item) : null;
  }

  async getByReferenceIdAsync(refId: string): Promise<ProductDTO[]> {
    const items = await this.repository.findByReferenceId(refId);
    return items.map(this.toDTO);
  }

  async searchByNameAsync(text: string): Promise<ProductDTO[]> {
    const items = await this.repository.searchByName(text);
    return items.map(this.toDTO);
  }

  async createAsync(dto: CreateProductDTO): Promise<ProductDTO> {
    const item = await this.repository.create(dto);
    return this.toDTO(item);
  }

  async updateAsync(id: string, dto: UpdateProductDTO): Promise<ProductDTO> {
    const updateData: any = {};
    if (dto.code !== undefined) updateData.Code = dto.code;
    if (dto.name !== undefined) updateData.Name = dto.name;
    if (dto.description !== undefined) updateData.Description = dto.description;
    if (dto.imageProduct !== undefined) updateData.ImageProduct = dto.imageProduct;
    if (dto.referenceId !== undefined) updateData.ReferenceId = dto.referenceId;
    if (dto.unitPrice !== undefined) updateData.UnitPrice = dto.unitPrice;
    if (dto.costPrice !== undefined) updateData.CostPrice = dto.costPrice;
    if (dto.minStock !== undefined) updateData.MinStock = dto.minStock;
    if (dto.isActive !== undefined) updateData.IsActive = dto.isActive;
    const item = await this.repository.update(id, updateData);
    return this.toDTO(item);
  }

  async deleteAsync(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }

  private toDTO(c: any): ProductDTO {
    const stocks: any[] = c.Stocks || [];
    const stock = stocks.reduce((sum: number, s: any) => sum + Number(s.Quantity), 0);
    return {
      id: c.Id, code: c.Code, name: c.Name, description: c.Description,
      imageProduct: c.ImageProduct, referenceId: c.ReferenceId,
      referenceName: c.Reference?.Name,
      unitPrice: Number(c.UnitPrice), costPrice: Number(c.CostPrice),
      minStock: c.MinStock, stock, isActive: c.IsActive,
      createdAt: c.CreatedAt?.toISOString(), updatedAt: c.UpdatedAt?.toISOString(),
    };
  }
}
