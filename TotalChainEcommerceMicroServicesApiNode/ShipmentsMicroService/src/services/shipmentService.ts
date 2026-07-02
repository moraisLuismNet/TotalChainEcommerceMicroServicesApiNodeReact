import { CreateShipmentDTO } from "../core/dtos/Shipment/CreateShipmentDTO";
import { UpdateShipmentStatusDTO } from "../core/dtos/Shipment/UpdateShipmentStatusDTO";
import { ShipmentRepository } from "../database/repositories/ShipmentRepository";
import Shipment from "../database/models/Shipment";
import HttpOrderService from "./httpClients/HttpOrderService";
import HttpEmailService from "./httpClients/HttpEmailService";
import HttpAuditLogService from "./httpClients/HttpAuditLogService";
import crypto from "crypto";

interface SimulatedShipment {
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
  currentLatitude: number;
  currentLongitude: number;
}

export class ShipmentService {
  private shipmentRepo: ShipmentRepository;
  constructor() { this.shipmentRepo = new ShipmentRepository(); }
  private generateTrackingNumber(): string {
    return "SHIP-" + crypto.randomBytes(8).toString("hex").toUpperCase();
  }
  private simulateShipment(shipment: any): SimulatedShipment {
    const s = shipment.toJSON ? shipment.toJSON() : { ...shipment };
    const createdAt = s.CreatedAt ? new Date(s.CreatedAt) : new Date();
    const elapsedMs = Date.now() - createdAt.getTime();

    if (elapsedMs < 60000) {
      s.Status = "OutForDelivery";
      s.currentLatitude = s.OriginLatitude;
      s.currentLongitude = s.OriginLongitude;
      s.OutForDeliveryAt = createdAt;
      s.InTransitAt = null;
      s.DeliveredAt = null;
    } else if (elapsedMs < 120000) {
      s.Status = "InTransit";
      s.OutForDeliveryAt = createdAt;
      s.InTransitAt = new Date(createdAt.getTime() + 60000);
      s.DeliveredAt = null;
      const ratio = (elapsedMs - 60000) / 60000;
      s.currentLatitude = s.OriginLatitude + (s.DestinationLatitude - s.OriginLatitude) * ratio;
      s.currentLongitude = s.OriginLongitude + (s.DestinationLongitude - s.OriginLongitude) * ratio;
    } else {
      s.Status = "Delivered";
      s.OutForDeliveryAt = createdAt;
      s.InTransitAt = new Date(createdAt.getTime() + 60000);
      s.DeliveredAt = new Date(createdAt.getTime() + 120000);
      s.currentLatitude = s.DestinationLatitude;
      s.currentLongitude = s.DestinationLongitude;
    }
    return s;
  }
  async createShipment(dto: CreateShipmentDTO): Promise<any> {
    const trackingNumber = this.generateTrackingNumber();
    const shipment = await this.shipmentRepo.create({
      OrderId: dto.OrderId,
      TrackingNumber: trackingNumber,
      Status: "OutForDelivery",
      OriginAddress: dto.OriginAddress,
      DestinationAddress: dto.DestinationAddress,
      OriginLatitude: dto.OriginLatitude,
      OriginLongitude: dto.OriginLongitude,
      DestinationLatitude: dto.DestinationLatitude,
      DestinationLongitude: dto.DestinationLongitude,
      UserEmail: dto.UserEmail,
    });
    await HttpOrderService.updateOrderStatus(dto.OrderId, "Shipped");
    await HttpEmailService.sendEmail(dto.UserEmail, "Shipment Created", `Your shipment tracking number: ${trackingNumber}`);
    await HttpAuditLogService.sendLog("CREATE_SHIPMENT", "Shipment", shipment.Id, `Shipment created for order ${dto.OrderId}`, dto.UserEmail);
    return this.simulateShipment(shipment);
  }
  async updateShipmentStatus(id: number, dto: UpdateShipmentStatusDTO): Promise<any | null> {
    const updateData: any = { Status: dto.status };
    const now = new Date();
    if (dto.status === "OutForDelivery") updateData.OutForDeliveryAt = now;
    if (dto.status === "InTransit") updateData.InTransitAt = now;
    if (dto.status === "Delivered") updateData.DeliveredAt = now;
    const shipment = await this.shipmentRepo.update(id, updateData);
    if (shipment) {
      await HttpAuditLogService.sendLog("UPDATE_SHIPMENT_STATUS", "Shipment", id, `Status changed to ${dto.status}`, shipment.UserEmail);
    }
    return shipment ? this.simulateShipment(shipment) : null;
  }
  async getShipmentById(id: number): Promise<any | null> {
    const shipment = await this.shipmentRepo.findById(id);
    return shipment ? this.simulateShipment(shipment) : null;
  }
  async getAllShipments(): Promise<any[]> {
    const shipments = await this.shipmentRepo.findAll();
    return shipments.map(s => this.simulateShipment(s));
  }
  async getShipmentByOrderId(orderId: number): Promise<any | null> {
    const shipment = await this.shipmentRepo.findByOrderId(orderId);
    return shipment ? this.simulateShipment(shipment) : null;
  }
  async getShipmentByTrackingNumber(trackingNumber: string): Promise<any | null> {
    const shipment = await this.shipmentRepo.findByTrackingNumber(trackingNumber);
    return shipment ? this.simulateShipment(shipment) : null;
  }
  async getShipmentsByUserEmail(userEmail: string): Promise<any[]> {
    const shipments = await this.shipmentRepo.findByUserEmail(userEmail);
    return shipments.map(s => this.simulateShipment(s));
  }
}
export default new ShipmentService();
