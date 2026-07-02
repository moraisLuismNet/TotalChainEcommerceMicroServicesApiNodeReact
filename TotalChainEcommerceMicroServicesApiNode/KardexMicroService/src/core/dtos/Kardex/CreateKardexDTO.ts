export interface CreateKardexDTO {
  ProductId: string;
  MovementType: string;
  Quantity: number;
  StockBefore: number;
  StockAfter: number;
}
