export interface ProductDTO {
  id: string;
  code: string;
  name: string;
  description?: string;
  imageProduct?: string;
  referenceId: string;
  referenceName?: string;
  unitPrice: number;
  costPrice: number;
  minStock: number;
  stock: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
