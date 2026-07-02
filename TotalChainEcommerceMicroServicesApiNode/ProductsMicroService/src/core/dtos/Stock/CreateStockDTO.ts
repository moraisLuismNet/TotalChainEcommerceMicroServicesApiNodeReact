export interface CreateStockDTO {
  id: string;
  productId: string;
  quantity: number;
  warehouse: string;
  createdBy: string;
  updatedBy: string;
}
