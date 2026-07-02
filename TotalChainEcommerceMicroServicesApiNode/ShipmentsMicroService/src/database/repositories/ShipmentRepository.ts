import Shipment from "../models/Shipment";
import { BaseRepository } from "./BaseRepository";
import { IShipmentRepository } from "./interfaces/IShipmentRepository";
export class ShipmentRepository extends BaseRepository<Shipment> implements IShipmentRepository {
  constructor() { super(Shipment); }
  async findByOrderId(orderId: number): Promise<Shipment | null> {
    return Shipment.findOne({ where: { OrderId: orderId } });
  }
  async findByTrackingNumber(trackingNumber: string): Promise<Shipment | null> {
    return Shipment.findOne({ where: { TrackingNumber: trackingNumber } });
  }
  async findByUserEmail(userEmail: string): Promise<Shipment[]> {
    return Shipment.findAll({ where: { UserEmail: userEmail } });
  }
}
