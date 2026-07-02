import { Router } from "express";
import PaymentController from "../controllers/paymentController";
import { authMiddleware } from "../middleware/authMiddleware";
import internalAuthMiddleware from "../middleware/internalAuthMiddleware";
const router = Router();
/**
 * @swagger
 * /api/payments/create-checkout-session:
 *   post:
 *     summary: Create a Stripe checkout session
 *     tags: [Payments]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name: { type: string }
 *                     quantity: { type: integer }
 *                     price: { type: number }
 *               successUrl: { type: string }
 *               cancelUrl: { type: string }
 *     responses:
 *       200:
 *         description: Checkout session created
 */
router.post("/create-checkout-session", internalAuthMiddleware(), PaymentController.createCheckoutSession);
/**
 * @swagger
 * /api/payments/confirm:
 *   post:
 *     summary: Confirm payment after checkout
 *     tags: [Payments]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionId: { type: string }
 *               orderData: { type: object }
 *     responses:
 *       200:
 *         description: Payment confirmed
 */
router.post("/confirm", authMiddleware, PaymentController.confirmPayment);
router.get("/success", authMiddleware, PaymentController.paymentSuccess);
router.get("/cancel", authMiddleware, PaymentController.paymentCancel);
/**
 * @swagger
 * /api/payments/webhook:
 *   post:
 *     summary: Stripe webhook endpoint
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook received
 */
router.post("/webhook", PaymentController.handleWebhook);
export default router;
