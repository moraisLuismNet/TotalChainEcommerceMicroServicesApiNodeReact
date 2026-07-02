import Payment from "../../models/Payment";
import { IBaseRepository } from "./IBaseRepository";
export interface IPaymentRepository extends IBaseRepository<Payment> {
  findByStripeSessionId(sessionId: string): Promise<Payment | null>;
  findByOrderId(orderId: number): Promise<Payment | null>;
}
