export interface CreateShipmentDTO {
  OrderId: number;
  OriginAddress: string;
  DestinationAddress: string;
  OriginLatitude: number;
  OriginLongitude: number;
  DestinationLatitude: number;
  DestinationLongitude: number;
  UserEmail: string;
}
