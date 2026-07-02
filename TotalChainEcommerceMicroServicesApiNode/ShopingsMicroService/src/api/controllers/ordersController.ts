import { Request, Response } from "express";
import { OrderService } from "../../services/orderService";
import { ResponseHelper } from "../../core/helpers/ResponseHelper";

const orderService = new OrderService();

export async function getAll(req: Request, res: Response) {
  try {
    const orders = await orderService.getAllOrders();
    return ResponseHelper.success(res, "Orders retrieved", orders);
  } catch (e: any) { return ResponseHelper.error(res, "Failed", e.message); }
}

export async function getMyOrders(req: Request, res: Response) {
  try {
    const email = req.userEmail;
    if (!email) return ResponseHelper.unauthorized(res);
    const orders = await orderService.getOrdersByUserEmail(email);
    return ResponseHelper.success(res, "Orders retrieved", orders);
  } catch (e: any) { return ResponseHelper.error(res, "Failed", e.message); }
}

export async function getByEmail(req: Request, res: Response) {
  try {
    const { email } = req.params;
    const orders = await orderService.getOrdersByUserEmail(email);
    return ResponseHelper.success(res, "Orders retrieved", orders);
  } catch (e: any) { return ResponseHelper.error(res, "Failed", e.message); }
}

export async function createFromCart(req: Request, res: Response) {
  try {
    const { email } = req.params;
    const { cartId, paymentMethod } = req.body;
    if (!cartId) return ResponseHelper.badRequest(res, "cartId is required");
    const order = await orderService.createOrderFromCart(cartId, email, paymentMethod || "Credit Card");
    return ResponseHelper.created(res, "Order created from cart", order);
  } catch (e: any) { return ResponseHelper.error(res, "Failed", e.message); }
}

export async function create(req: Request, res: Response) {
  try {
    const userEmail = req.userEmail || req.body.userEmail || "";
    const paymentMethod = req.body.paymentMethod || "Credit Card";
    if (!userEmail) return ResponseHelper.badRequest(res, "userEmail is required");
    const order = await orderService.createOrderAndFinalize(userEmail, paymentMethod);
    if (!order) return ResponseHelper.success(res, "Order already exists", null);
    return ResponseHelper.created(res, "Order created", order);
  } catch (e: any) { return ResponseHelper.error(res, "Failed", e.message); }
}

export async function cancelOrder(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return ResponseHelper.badRequest(res, "Invalid order id");
    const order = await orderService.updateOrderStatus(id, "cancelled");
    return ResponseHelper.success(res, "Order cancelled", order);
  } catch (e: any) { return ResponseHelper.error(res, "Failed", e.message); }
}

export async function getById(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return ResponseHelper.badRequest(res, "Invalid order id");
    const order = await orderService.getOrderById(id);
    if (!order) return ResponseHelper.notFound(res, "Order not found");
    return ResponseHelper.success(res, "Order retrieved", order);
  } catch (e: any) { return ResponseHelper.error(res, "Failed", e.message); }
}

export async function updateStatus(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return ResponseHelper.badRequest(res, "Invalid order id");
    const { status } = req.body;
    if (!status) return ResponseHelper.badRequest(res, "Status is required");
    const order = await orderService.updateOrderStatus(id, status);
    return ResponseHelper.success(res, "Order status updated", order);
  } catch (e: any) { return ResponseHelper.error(res, "Failed", e.message); }
}
