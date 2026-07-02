import Shipment from "../../models/Shipment";
import { IBaseRepository } from "./IBaseRepository";
export interface IShipmentRepository extends IBaseRepository<Shipment> {
  findByOrderId(orderId: number): Promise<Shipment | null>;
  findByTrackingNumber(trackingNumber: string): Promise<Shipment | null>;
  findByUserEmail(userEmail: string): Promise<Shipment[]>;
}
