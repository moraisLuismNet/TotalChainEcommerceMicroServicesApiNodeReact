export interface CreateReferenceDTO {
  id: string;
  name: string;
  description?: string;
  subCategoryId: string;
  isActive?: boolean;
}
