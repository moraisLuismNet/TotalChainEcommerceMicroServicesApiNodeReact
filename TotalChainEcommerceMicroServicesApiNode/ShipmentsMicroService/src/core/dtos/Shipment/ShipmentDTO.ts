export interface ShipmentDTO {
  Id: number;
  OrderId: number;
  TrackingNumber: string;
  Status: string;
  CreatedAt: Date;
  OutForDeliveryAt: Date | null;
  InTransitAt: Date | null;
  DeliveredAt: Date | null;
  OriginAddress: string;
  DestinationAddress: string;
  OriginLatitude: number;
  OriginLongitude: number;
  DestinationLatitude: number;
  DestinationLongitude: number;
  UserEmail: string;
}
