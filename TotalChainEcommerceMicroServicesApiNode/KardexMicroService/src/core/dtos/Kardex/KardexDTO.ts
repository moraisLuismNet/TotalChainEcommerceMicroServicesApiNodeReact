export interface KardexDTO {
  Id: number;
  ProductId: string;
  Date: Date;
  MovementType: string;
  Quantity: number;
  StockBefore: number;
  StockAfter: number;
}
