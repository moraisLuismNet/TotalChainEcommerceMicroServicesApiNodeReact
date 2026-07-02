import { Router } from "express";
import { getDetails, addItem, removeItem } from "../controllers/cartDetailsController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /api/cart-details/{email}:
 *   get:
 *     tags: [CartDetails]
 *     summary: Get cart details by email
 *     security: [{ BearerAuth: [] }]
 *     parameters: [{ in: path, name: email, required: true, schema: { type: string } }]
 *     responses: { 200: { description: Cart details retrieved } }
 */
router.get("/:email", getDetails);

/**
 * @swagger
 * /api/cart-details/add/{email}:
 *   post:
 *     tags: [CartDetails]
 *     summary: Add item to cart
 *     security: [{ BearerAuth: [] }]
 *     parameters: [{ in: path, name: email, required: true, schema: { type: string } }]
 *     requestBody: { required: true, content: { application/json: { schema: { type: object, properties: { productId: { type: string }, amount: { type: integer }, price: { type: number } } } } } }
 *     responses: { 200: { description: Item added } }
 */
router.post("/add/:email", addItem);

/**
 * @swagger
 * /api/cart-details/remove/{email}/{productId}:
 *   post:
 *     tags: [CartDetails]
 *     summary: Remove item from cart
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: integer
 *     responses: { 200: { description: Item removed } }
 */
router.post("/remove/:email/:productId", removeItem);

export default router;
