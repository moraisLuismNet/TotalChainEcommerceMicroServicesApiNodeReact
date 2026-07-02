import { CreateCheckoutSessionDTO } from "../core/dtos/Payment/CreateCheckoutSessionDTO";
import { CheckoutSessionResponseDTO } from "../core/dtos/Payment/CheckoutSessionResponseDTO";
import { ConfirmPaymentDTO } from "../core/dtos/Payment/ConfirmPaymentDTO";
import { IPaymentService } from "./interfaces/IPaymentService";
import { IStripeProvider } from "./interfaces/IStripeProvider";
import { IHttpOrderService } from "./interfaces/IHttpOrderService";
import StripeProvider from "./stripeProvider";
import HttpOrderService from "./httpClients/HttpOrderService";
import HttpAuditLogService from "./httpClients/HttpAuditLogService";
import HttpUserService from "./httpClients/HttpUserService";
import HttpShipmentService from "./httpClients/HttpShipmentService";
import HttpWhatsAppService from "./httpClients/HttpWhatsAppService";
import { PaymentRepository } from "../database/repositories/PaymentRepository";
import Payment from "../database/models/Payment";
import stripe from "../core/config/stripeConfig";
export class PaymentService implements IPaymentService {
  private stripeProvider: IStripeProvider;
  private orderService: IHttpOrderService;
  private paymentRepo: PaymentRepository;
  constructor() {
    this.stripeProvider = StripeProvider;
    this.orderService = HttpOrderService;
    this.paymentRepo = new PaymentRepository();
  }
  async createCheckoutSession(dto: CreateCheckoutSessionDTO, userEmail: string): Promise<CheckoutSessionResponseDTO> {
    const session = await this.stripeProvider.createCheckoutSession(
      dto.items,
      dto.successUrl || process.env.STRIPE_SUCCESS_URL || "",
      dto.cancelUrl || process.env.STRIPE_CANCEL_URL || "",
      userEmail
    );
    const amount = dto.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    await this.paymentRepo.create({
      StripeSessionId: session.id,
      Amount: amount,
      Currency: session.currency,
      Status: "pending",
      CheckoutData: JSON.stringify(dto),
    });
    await HttpAuditLogService.sendLog("CREATE_CHECKOUT_SESSION", "Payment", session.id, `Checkout session created for ${userEmail}`, userEmail);
    return { sessionId: session.id, url: session.url || "" };
  }
  async confirmPayment(dto: ConfirmPaymentDTO, userEmail: string): Promise<Payment> {
    const sessionResult = await this.stripeProvider.retrieveSession(dto.sessionId);
    const payment = await this.paymentRepo.findByStripeSessionId(dto.sessionId);
    if (!payment) throw new Error("Payment not found");
    if (sessionResult.paymentStatus === "paid" || sessionResult.paymentStatus === "complete") {
      const orderResponse = await this.orderService.createOrder({ userEmail, paymentMethod: "Credit Card" });
      const orderId = orderResponse?.data?.idOrder || orderResponse?.data?.id || 0;
      await this.paymentRepo.update(payment.Id, {
        Status: "completed",
        StripePaymentIntentId: sessionResult.paymentIntentId,
        OrderId: orderId,
        PaidAt: new Date(),
      });
      await this.afterPaymentConfirmed(orderId, userEmail);
      await HttpAuditLogService.sendLog("CONFIRM_PAYMENT", "Payment", payment.Id, `Payment confirmed for session ${dto.sessionId}`, userEmail);
      const updated = await this.paymentRepo.findById(payment.Id);
      return updated!;
    } else {
      await this.paymentRepo.update(payment.Id, { Status: "failed" });
      throw new Error("Payment not completed");
    }
  }
  private getCoordinatesFromAddress(address: string): { lat: number; lng: number } {
    const addr = address.toLowerCase();
    if (addr.includes("sevilla") || addr.includes("seville")) return { lat: 37.3891, lng: -5.9845 };
    if (addr.includes("madrid")) return { lat: 40.4168, lng: -3.7038 };
    if (addr.includes("barcelona")) return { lat: 41.3874, lng: 2.1686 };
    if (addr.includes("valencia")) return { lat: 39.4699, lng: -0.3763 };
    if (addr.includes("bilbao")) return { lat: 43.2630, lng: -2.9350 };
    if (addr.includes("málaga") || addr.includes("malaga")) return { lat: 36.7213, lng: -4.4214 };
    return { lat: 40.4168, lng: -3.7038 };
  }

  private async afterPaymentConfirmed(orderId: number, userEmail: string): Promise<void> {
    try {
      const userResponse = await HttpUserService.getUserByEmail(userEmail);
      const user = userResponse?.data || userResponse;
      const destAddress = user?.address || user?.Address || userEmail;
      const phoneNumber = user?.phoneNumber || user?.PhoneNumber;
      const destCoords = this.getCoordinatesFromAddress(destAddress);
      await HttpShipmentService.createShipment({
        OrderId: orderId,
        DestinationAddress: destAddress,
        UserEmail: userEmail,
        OriginAddress: "TotalChain Warehouse, Madrid, Spain",
        OriginLatitude: 40.4168,
        OriginLongitude: -3.7038,
        DestinationLatitude: destCoords.lat,
        DestinationLongitude: destCoords.lng,
      });
      if (phoneNumber) {
        const userName = userEmail.split("@")[0];
        const formattedName = userName.charAt(0).toUpperCase() + userName.slice(1);
        await HttpWhatsAppService.scheduleNotifications(phoneNumber, orderId, formattedName);
      }
    } catch (err: any) {
      console.error("[PAYMENT] afterPaymentConfirmed error:", err.message);
    }
  }
  async handleStripeWebhook(body: any, signature: string): Promise<void> {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
    let event;
    if (endpointSecret) {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } else {
      event = body;
    }
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const payment = await this.paymentRepo.findByStripeSessionId(session.id);
      if (payment) {
        await this.paymentRepo.update(payment.Id, {
          Status: "completed",
          StripePaymentIntentId: session.payment_intent,
          PaidAt: new Date(),
        });
      }
    }
  }
  async getPaymentBySessionId(sessionId: string): Promise<Payment | null> {
    return this.paymentRepo.findByStripeSessionId(sessionId);
  }
}
export default new PaymentService();
