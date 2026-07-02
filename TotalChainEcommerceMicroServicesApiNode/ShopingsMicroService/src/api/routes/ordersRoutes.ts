import { Router } from "express";
import { getAll, getMyOrders, getByEmail, createFromCart, cancelOrder, getById, updateStatus, create } from "../controllers/ordersController";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware";
import internalAuthMiddleware from "../middleware/internalAuthMiddleware";

const router = Router();

/**
 * @swagger
 * /api/orders:
 *   post:
 *     tags: [Orders]
 *     summary: Create order from active cart and finalize (inter-service)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userEmail:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *     responses:
 *       201:
 *         description: Order created
 */
router.post("/", internalAuthMiddleware(), create);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     tags: [Orders]
 *     summary: Update order status (inter-service)
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status updated
 */
router.put("/:id/status", internalAuthMiddleware(), updateStatus);

router.use(authMiddleware);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     tags: [Orders]
 *     summary: Get all orders (admin)
 *     security: [{ BearerAuth: [] }]
 *     responses: { 200: { description: List of orders } }
 */
router.get("/", adminMiddleware, getAll);

router.get("/my", getMyOrders);

/**
 * @swagger
 * /api/orders/{email}:
 *   get:
 *     tags: [Orders]
 *     summary: Get orders by user email
 *     security: [{ BearerAuth: [] }]
 *     parameters: [{ in: path, name: email, required: true, schema: { type: string } }]
 *     responses: { 200: { description: Orders retrieved } }
 */
router.get("/:email", getByEmail);

/**
 * @swagger
 * /api/orders/from-cart/{email}:
 *   post:
 *     tags: [Orders]
 *     summary: Create order from cart
 *     security: [{ BearerAuth: [] }]
 *     parameters: [{ in: path, name: email, required: true, schema: { type: string } }]
 *     requestBody: { required: true, content: { application/json: { schema: { type: object, properties: { cartId: { type: integer }, paymentMethod: { type: string } } } } } }
 *     responses: { 201: { description: Order created } }
 */
router.post("/from-cart/:email", createFromCart);

/**
 * @swagger
 * /api/orders/cancel/{id}:
 *   post:
 *     tags: [Orders]
 *     summary: Cancel an order
 *     security: [{ BearerAuth: [] }]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: integer } }]
 *     responses: { 200: { description: Order cancelled } }
 */
router.post("/cancel/:id", cancelOrder);

export default router;
