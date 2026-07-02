import Payment from "../models/Payment";
import { BaseRepository } from "./BaseRepository";
import { IPaymentRepository } from "./interfaces/IPaymentRepository";
export class PaymentRepository extends BaseRepository<Payment> implements IPaymentRepository {
  constructor() { super(Payment); }
  async findByStripeSessionId(sessionId: string): Promise<Payment | null> {
    return Payment.findOne({ where: { StripeSessionId: sessionId } });
  }
  async findByOrderId(orderId: number): Promise<Payment | null> {
    return Payment.findOne({ where: { OrderId: orderId } });
  }
}
