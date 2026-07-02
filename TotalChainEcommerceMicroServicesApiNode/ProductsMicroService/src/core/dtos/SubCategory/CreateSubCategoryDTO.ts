export interface CreateSubCategoryDTO {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  isActive?: boolean;
}
