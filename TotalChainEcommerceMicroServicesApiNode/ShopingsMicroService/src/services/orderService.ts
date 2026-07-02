import { OrderRepository } from "../database/repositories/OrderRepository";
import { OrderDetailRepository } from "../database/repositories/OrderDetailRepository";
import { CartRepository } from "../database/repositories/CartRepository";
import { CartDetailRepository } from "../database/repositories/CartDetailRepository";
import { OrderDTO, OrderDetailDTO } from "../core/dtos/Order/OrderDTO";
import { HttpEmailService } from "./httpClients/HttpEmailService";
import { HttpAuditLogService } from "./httpClients/HttpAuditLogService";

export class OrderService {
  private orderRepo: OrderRepository;
  private orderDetailRepo: OrderDetailRepository;
  private cartRepo: CartRepository;
  private cartDetailRepo: CartDetailRepository;

  constructor() {
    this.orderRepo = new OrderRepository();
    this.orderDetailRepo = new OrderDetailRepository();
    this.cartRepo = new CartRepository();
    this.cartDetailRepo = new CartDetailRepository();
  }

  async createOrderFromCart(cartId: number, userEmail: string, paymentMethod: string): Promise<OrderDTO> {
    const cart = await this.cartRepo.getById(cartId);
    if (!cart) throw new Error("Cart not found");
    if (cart.UserEmail !== userEmail) throw new Error("Cart does not belong to this user");

    const cartDetails = await this.cartDetailRepo.getByCartId(cartId);
    if (cartDetails.length === 0) throw new Error("Cannot create order from empty cart");

    const total = cartDetails.reduce((sum, d) => sum + (d.Price || d.Amount * d.Price), 0);

    const order = await this.orderRepo.create({
      Total: total,
      UserEmail: userEmail,
      CartId: cartId,
      PaymentMethod: paymentMethod,
      Status: "pending"
    });

    for (const detail of cartDetails) {
      await this.orderDetailRepo.create({
        OrderId: order.IdOrder,
        ProductId: detail.ProductId,
        Amount: detail.Amount,
        Price: detail.Price
      });
    }

    await this.cartRepo.update(cartId, { Enabled: false });

    await HttpEmailService.sendEmail(userEmail, "Order Confirmation", `Your order #${order.IdOrder} has been placed. Total: ${total}`, "order_confirmation");
    await HttpAuditLogService.sendLog("Order", order.IdOrder.toString(), "Created", null, { total, status: "pending" }, userEmail);

    return this.toOrderDTO(order);
  }

  async createOrderAndFinalize(userEmail: string, paymentMethod: string): Promise<OrderDTO | null> {
    const cart = await this.cartRepo.getActiveCartByUser(userEmail);
    if (!cart) return null;

    const cartDetails = await this.cartDetailRepo.getByCartId(cart.IdCart);
    if (cartDetails.length === 0) return null;

    const total = cartDetails.reduce((sum, d) => sum + Number(d.Price), 0);
    if (total <= 0) throw new Error("Cart total must be greater than 0");

    const order = await this.orderRepo.create({
      Total: total,
      UserEmail: userEmail,
      CartId: cart.IdCart,
      PaymentMethod: paymentMethod || "Credit Card",
      Status: "completed"
    });

    for (const detail of cartDetails) {
      await this.orderDetailRepo.create({
        OrderId: order.IdOrder,
        ProductId: detail.ProductId,
        Amount: detail.Amount,
        Price: Number(detail.Price) / detail.Amount
      });
    }

    await this.cartDetailRepo.deleteByCartId(cart.IdCart);
    await this.cartRepo.update(cart.IdCart, { Enabled: false, TotalPrice: 0 } as any);

    const details = await this.orderDetailRepo.getByOrderId(order.IdOrder);
    const itemsHtml = details.map(d => `
      <tr style="border-bottom:1px solid #eee;">
        <td style="padding:10px;"><strong>${d.ProductId}</strong></td>
        <td style="padding:10px;text-align:center;">${d.Amount}</td>
        <td style="padding:10px;text-align:right;">${Number(d.Price).toFixed(2)}€</td>
        <td style="padding:10px;text-align:right;">${(Number(d.Price) * d.Amount).toFixed(2)}€</td>
      </tr>`).join("");

    const subject = `Order Confirmation #${order.IdOrder}`;
    const emailBody = `
      <div style="font-family:Arial,sans-serif;color:#333;max-width:600px;margin:0 auto;border:1px solid #eee;padding:20px;border-radius:10px;">
        <h1 style="color:#4CAF50;text-align:center;">Order Confirmation</h1>
        <p>Dear ${userEmail.split("@")[0]},</p>
        <p>Your payment has been received and your order is now confirmed. Thank you for your purchase!</p>
        <div style="background-color:#f9f9f9;padding:15px;border-radius:5px;margin:20px 0;">
          <p style="margin:0;"><strong>Order ID:</strong> #${order.IdOrder}</p>
          <p style="margin:5px 0 0 0;"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          <p style="margin:5px 0 0 0;"><strong>Store:</strong> TotalChain E-Commerce</p>
        </div>
        <table style="width:100%;border-collapse:collapse;margin-top:20px;">
          <thead>
            <tr style="background-color:#4CAF50;color:white;">
              <th style="padding:10px;text-align:left;">Item</th>
              <th style="padding:10px;text-align:center;">Qty</th>
              <th style="padding:10px;text-align:right;">Price</th>
              <th style="padding:10px;text-align:right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="padding:15px 10px;text-align:right;font-weight:bold;">Total:</td>
              <td style="padding:15px 10px;text-align:right;font-weight:bold;color:#4CAF50;font-size:1.2em;">${Number(total).toFixed(2)}€</td>
            </tr>
          </tfoot>
        </table>
        <p style="margin-top:30px;">Thank you for choosing <strong>TotalChain E-Commerce</strong>.</p>
        <hr style="border:0;border-top:1px solid #eee;margin:20px 0;" />
        <p style="font-size:0.8em;color:#999;text-align:center;">This is an automated message.</p>
      </div>`;

    await HttpEmailService.sendEmail(userEmail, subject, emailBody, "order_confirmation");
    await HttpAuditLogService.sendLog("Order", order.IdOrder.toString(), "Created", null, { total, status: "completed" }, userEmail);

    return this.toOrderDTO(order, details);
  }

  async getOrdersByUserEmail(userEmail: string): Promise<OrderDTO[]> {
    const orders = await this.orderRepo.getByUserEmail(userEmail);
    return Promise.all(orders.map(async (o: any) => {
      const details = await this.orderDetailRepo.getByOrderId(o.IdOrder);
      return this.toOrderDTO(o, details);
    }));
  }

  async getOrderById(id: number): Promise<OrderDTO | null> {
    const order = await this.orderRepo.getById(id);
    if (!order) return null;
    const details = await this.orderDetailRepo.getByOrderId(order.IdOrder);
    return this.toOrderDTO(order, details);
  }

  async updateOrderStatus(id: number, status: string): Promise<OrderDTO> {
    const updated = await this.orderRepo.update(id, { Status: status });
    const oldStatus = status === "shipped" ? "processing" : "pending";
    await HttpAuditLogService.sendLog("Order", id.toString(), "StatusUpdated", { status: oldStatus }, { status }, "system");
    const details = await this.orderDetailRepo.getByOrderId(id);
    return this.toOrderDTO(updated, details);
  }

  async getAllOrders(): Promise<OrderDTO[]> {
    const orders = await this.orderRepo.getAll();
    return Promise.all(orders.map(async (o: any) => {
      const details = await this.orderDetailRepo.getByOrderId(o.IdOrder);
      return this.toOrderDTO(o, details);
    }));
  }

  private toOrderDTO(o: any, details: any[] = []): OrderDTO {
    return {
      idOrder: o.IdOrder,
      orderDate: o.OrderDate ? new Date(o.OrderDate).toISOString() : new Date().toISOString(),
      paymentMethod: o.PaymentMethod,
      total: o.Total,
      userEmail: o.UserEmail,
      cartId: o.CartId,
      status: o.Status,
      details: details.map(d => ({
        idOrderDetail: d.IdOrderDetail,
        orderId: d.OrderId,
        productId: d.ProductId,
        amount: d.Amount,
        price: d.Price,
        total: Number(d.Price) * d.Amount
      }))
    };
  }
}
