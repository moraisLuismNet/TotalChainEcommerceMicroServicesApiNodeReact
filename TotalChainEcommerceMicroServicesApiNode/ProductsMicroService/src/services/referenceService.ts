import { ReferenceRepository } from "../database/repositories/ReferenceRepository";
import { ReferenceDTO } from "../core/dtos/Reference/ReferenceDTO";
import { CreateReferenceDTO } from "../core/dtos/Reference/CreateReferenceDTO";
import { UpdateReferenceDTO } from "../core/dtos/Reference/UpdateReferenceDTO";

export class ReferenceService {
  private repository: ReferenceRepository;

  constructor() { this.repository = new ReferenceRepository(); }

  async getAllAsync(): Promise<ReferenceDTO[]> {
    const items = await this.repository.getAll();
    return items.map(this.toDTO);
  }

  async getByIdAsync(id: string): Promise<ReferenceDTO | null> {
    const item = await this.repository.getById(id);
    return item ? this.toDTO(item) : null;
  }

  async createAsync(dto: CreateReferenceDTO): Promise<ReferenceDTO> {
    const item = await this.repository.create(dto);
    return this.toDTO(item);
  }

  async updateAsync(id: string, dto: UpdateReferenceDTO): Promise<ReferenceDTO> {
    const updateData: any = {};
    if (dto.name !== undefined) updateData.Name = dto.name;
    if (dto.description !== undefined) updateData.Description = dto.description;
    if (dto.subCategoryId !== undefined) updateData.SubCategoryId = dto.subCategoryId;
    if (dto.isActive !== undefined) updateData.IsActive = dto.isActive;
    const item = await this.repository.update(id, updateData);
    return this.toDTO(item);
  }

  async getBySubCategoryAsync(subCategoryId: string): Promise<ReferenceDTO[]> {
    const items = await this.repository.findBySubCategory(subCategoryId);
    return items.map(this.toDTO);
  }

  async deleteAsync(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }

  private toDTO(c: any): ReferenceDTO {
    return { id: c.Id, name: c.Name, description: c.Description, subCategoryId: c.SubCategoryId, isActive: c.IsActive, createdAt: c.CreatedAt?.toISOString(), updatedAt: c.UpdatedAt?.toISOString() };
  }
}
