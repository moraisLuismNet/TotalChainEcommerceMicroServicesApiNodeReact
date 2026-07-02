import { Request, Response, NextFunction } from "express";
import { ResponseHelper } from "../../core/helpers/ResponseHelper";
import PaymentService from "../../services/paymentService";
export class PaymentController {
  async createCheckoutSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userEmail = req.userEmail || req.body.userEmail || "";
      const result = await PaymentService.createCheckoutSession(req.body, userEmail);
      ResponseHelper.success(res, "Checkout session created", result);
    } catch (err: any) {
      ResponseHelper.error(res, err.message, err.message, 400);
    }
  }
  async confirmPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userEmail = req.userEmail || req.body.userEmail || "";
      const body = {
        sessionId: req.body.sessionId || req.body.SessionId || "",
        orderData: req.body.orderData,
      };
      const payment = await PaymentService.confirmPayment(body, userEmail);
      ResponseHelper.success(res, "Payment confirmed", payment);
    } catch (err: any) {
      ResponseHelper.error(res, err.message, err.message, 400);
    }
  }
  async paymentSuccess(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = req.query.session_id as string;
      if (!sessionId) { ResponseHelper.badRequest(res, "Missing session_id"); return; }
      const payment = await PaymentService.getPaymentBySessionId(sessionId);
      ResponseHelper.success(res, "Payment retrieved", payment);
    } catch (err: any) {
      ResponseHelper.error(res, err.message, err.message, 400);
    }
  }
  async paymentCancel(req: Request, res: Response, next: NextFunction): Promise<void> {
    ResponseHelper.success(res, "Payment cancelled");
  }
  async handleWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const signature = req.headers["stripe-signature"] as string || "";
      await PaymentService.handleStripeWebhook(req.body, signature);
      ResponseHelper.success(res, "Webhook received");
    } catch (err: any) {
      ResponseHelper.error(res, err.message, err.message, 400);
    }
  }
}
export default new PaymentController();
