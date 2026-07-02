import { CategoryRepository } from "../database/repositories/CategoryRepository";
import { CategoryDTO } from "../core/dtos/Category/CategoryDTO";
import { CreateCategoryDTO } from "../core/dtos/Category/CreateCategoryDTO";
import { UpdateCategoryDTO } from "../core/dtos/Category/UpdateCategoryDTO";

export class CategoryService {
  private repository: CategoryRepository;

  constructor() { this.repository = new CategoryRepository(); }

  async getAllAsync(): Promise<CategoryDTO[]> {
    const categories = await this.repository.getAll();
    return categories.map(this.toDTO);
  }

  async getByIdAsync(id: string): Promise<CategoryDTO | null> {
    const category = await this.repository.getById(id);
    return category ? this.toDTO(category) : null;
  }

  async createAsync(dto: CreateCategoryDTO): Promise<CategoryDTO> {
    const category = await this.repository.create(dto);
    return this.toDTO(category);
  }

  async updateAsync(id: string, dto: UpdateCategoryDTO): Promise<CategoryDTO> {
    const updateData: any = {};
    if (dto.name !== undefined) updateData.Name = dto.name;
    if (dto.description !== undefined) updateData.Description = dto.description;
    if (dto.isActive !== undefined) updateData.IsActive = dto.isActive;
    const category = await this.repository.update(id, updateData);
    return this.toDTO(category);
  }

  async deleteAsync(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }

  private toDTO(c: any): CategoryDTO {
    return { id: c.Id, name: c.Name, description: c.Description, isActive: c.IsActive, createdAt: c.CreatedAt?.toISOString(), updatedAt: c.UpdatedAt?.toISOString() };
  }
}
