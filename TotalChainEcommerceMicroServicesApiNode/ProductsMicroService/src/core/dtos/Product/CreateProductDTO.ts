export interface CreateProductDTO {
  id: string;
  code: string;
  name: string;
  description?: string;
  imageProduct?: string;
  referenceId: string;
  unitPrice: number;
  costPrice: number;
  minStock?: number;
  isActive?: boolean;
}
