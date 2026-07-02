import { Request, Response, NextFunction } from "express";
import { ResponseHelper } from "../../core/helpers/ResponseHelper";
import ShipmentService from "../../services/shipmentService";
export class ShipmentController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const shipments = await ShipmentService.getAllShipments();
      ResponseHelper.success(res, "Shipments retrieved", shipments);
    } catch (err: any) {
      ResponseHelper.error(res, err.message, err.message);
    }
  }
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const shipment = await ShipmentService.getShipmentById(id);
      if (!shipment) { ResponseHelper.notFound(res); return; }
      ResponseHelper.success(res, "Shipment retrieved", shipment);
    } catch (err: any) {
      ResponseHelper.error(res, err.message, err.message);
    }
  }
  async getByTrackingNumber(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { trackingNumber } = req.params;
      const shipment = await ShipmentService.getShipmentByTrackingNumber(trackingNumber);
      if (!shipment) { ResponseHelper.notFound(res); return; }
      ResponseHelper.success(res, "Shipment retrieved", shipment);
    } catch (err: any) {
      ResponseHelper.error(res, err.message, err.message);
    }
  }
  async getMyShipments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userEmail = req.userEmail || "";
      const shipments = await ShipmentService.getShipmentsByUserEmail(userEmail);
      ResponseHelper.success(res, "Shipments retrieved", shipments);
    } catch (err: any) {
      ResponseHelper.error(res, err.message, err.message);
    }
  }
  async getByOrderId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orderId = parseInt(req.params.orderId);
      const shipment = await ShipmentService.getShipmentByOrderId(orderId);
      if (!shipment) { ResponseHelper.notFound(res); return; }
      ResponseHelper.success(res, "Shipment retrieved", shipment);
    } catch (err: any) {
      ResponseHelper.error(res, err.message, err.message);
    }
  }
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const shipment = await ShipmentService.createShipment(req.body);
      ResponseHelper.created(res, "Shipment created", shipment);
    } catch (err: any) {
      ResponseHelper.error(res, err.message, err.message, 400);
    }
  }
  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const shipment = await ShipmentService.updateShipmentStatus(id, req.body);
      if (!shipment) { ResponseHelper.notFound(res); return; }
      ResponseHelper.success(res, "Shipment status updated", shipment);
    } catch (err: any) {
      ResponseHelper.error(res, err.message, err.message);
    }
  }
}
export default new ShipmentController();
