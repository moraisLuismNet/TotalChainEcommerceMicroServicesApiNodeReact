import { SubCategoryRepository } from "../database/repositories/SubCategoryRepository";
import { SubCategoryDTO } from "../core/dtos/SubCategory/SubCategoryDTO";
import { CreateSubCategoryDTO } from "../core/dtos/SubCategory/CreateSubCategoryDTO";
import { UpdateSubCategoryDTO } from "../core/dtos/SubCategory/UpdateSubCategoryDTO";

export class SubCategoryService {
  private repository: SubCategoryRepository;

  constructor() { this.repository = new SubCategoryRepository(); }

  async getAllAsync(): Promise<SubCategoryDTO[]> {
    const items = await this.repository.getAll();
    return items.map(this.toDTO);
  }

  async getByIdAsync(id: string): Promise<SubCategoryDTO | null> {
    const item = await this.repository.getById(id);
    return item ? this.toDTO(item) : null;
  }

  async createAsync(dto: CreateSubCategoryDTO): Promise<SubCategoryDTO> {
    const item = await this.repository.create(dto);
    return this.toDTO(item);
  }

  async updateAsync(id: string, dto: UpdateSubCategoryDTO): Promise<SubCategoryDTO> {
    const updateData: any = {};
    if (dto.name !== undefined) updateData.Name = dto.name;
    if (dto.description !== undefined) updateData.Description = dto.description;
    if (dto.categoryId !== undefined) updateData.CategoryId = dto.categoryId;
    if (dto.isActive !== undefined) updateData.IsActive = dto.isActive;
    const item = await this.repository.update(id, updateData);
    return this.toDTO(item);
  }

  async getByCategoryAsync(categoryId: string): Promise<SubCategoryDTO[]> {
    const items = await this.repository.findByCategory(categoryId);
    return items.map(this.toDTO);
  }

  async deleteAsync(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }

  private toDTO(c: any): SubCategoryDTO {
    return { id: c.Id, description: c.Description, name: c.Name, categoryId: c.CategoryId, isActive: c.IsActive, createdAt: c.CreatedAt?.toISOString(), updatedAt: c.UpdatedAt?.toISOString() };
  }
}
