import { Router } from "express";
import { getAllCarts, getCart, getCartByEmail, getCartStatus, getCartDetails, getCartCount, addItemByEmail, updateItemByEmail, removeItemByEmail, emptyCart, checkout, enableCart, disableCart } from "../controllers/cartsController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /api/carts:
 *   get:
 *     tags: [Carts]
 *     summary: Get cart for authenticated user
 *     security: [{ BearerAuth: [] }]
 *     responses: { 200: { description: Cart retrieved }, 404: { description: Cart not found } }
 */
router.get("/", getCart);

/**
 * @swagger
 * /api/carts/all:
 *   get:
 *     tags: [Carts]
 *     summary: Get all carts (admin)
 *     security: [{ BearerAuth: [] }]
 *     responses: { 200: { description: All carts retrieved } }
 */
router.get("/all", getAllCarts);

router.post("/checkout", checkout);

/**
 * @swagger
 * /api/carts/status/{email}:
 *   get:
 *     tags: [Carts]
 *     summary: Get cart enable status
 *     security: [{ BearerAuth: [] }]
 *     parameters: [{ in: path, name: email, required: true, schema: { type: string } }]
 *     responses: { 200: { description: Cart status } }
 */
router.get("/status/:email", getCartStatus);

/**
 * @swagger
 * /api/carts/{email}:
 *   get:
 *     tags: [Carts]
 *     summary: Get cart by user email
 *     security: [{ BearerAuth: [] }]
 *     parameters: [{ in: path, name: email, required: true, schema: { type: string } }]
 *     responses: { 200: { description: Cart retrieved } }
 */
router.get("/:email", getCartByEmail);

/**
 * @swagger
 * /api/carts/{email}/details:
 *   get:
 *     tags: [Carts]
 *     summary: Get cart details by email
 *     security: [{ BearerAuth: [] }]
 *     parameters: [{ in: path, name: email, required: true, schema: { type: string } }]
 *     responses: { 200: { description: Cart details } }
 */
router.get("/:email/details", getCartDetails);

/**
 * @swagger
 * /api/carts/{email}/count:
 *   get:
 *     tags: [Carts]
 *     summary: Get cart item count
 *     security: [{ BearerAuth: [] }]
 *     parameters: [{ in: path, name: email, required: true, schema: { type: string } }]
 *     responses: { 200: { description: Cart item count } }
 */
router.get("/:email/count", getCartCount);

/**
 * @swagger
 * /api/carts/{email}/items:
 *   post:
 *     tags: [Carts]
 *     summary: Add item to cart
 *     security: [{ BearerAuth: [] }]
 *     parameters: [{ in: path, name: email, required: true, schema: { type: string } }]
 *     requestBody: { required: true, content: { application/json: { schema: { type: object, properties: { productId: { type: string }, amount: { type: integer }, price: { type: number }, productName: { type: string }, unitPrice: { type: number } } } } } }
 *     responses: { 200: { description: Item added } }
 */
router.post("/:email/items", addItemByEmail);

/**
 * @swagger
 * /api/carts/{email}/items:
 *   put:
 *     tags: [Carts]
 *     summary: Update cart item
 *     security: [{ BearerAuth: [] }]
 *     parameters: [{ in: path, name: email, required: true, schema: { type: string } }]
 *     requestBody: { required: true, content: { application/json: { schema: { type: object, properties: { idCartDetail: { type: integer }, amount: { type: integer }, price: { type: number } } } } } }
 *     responses: { 200: { description: Item updated } }
 */
router.put("/:email/items", updateItemByEmail);

/**
 * @swagger
 * /api/carts/{email}/items/{productId}:
 *   delete:
 *     tags: [Carts]
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
 *     responses: { 200: { description: Item removed } }
 */
router.delete("/:email/items/:productId", removeItemByEmail);

router.delete("/", emptyCart);

/**
 * @swagger
 * /api/carts/{email}/enable:
 *   patch:
 *     tags: [Carts]
 *     summary: Enable cart
 *     security: [{ BearerAuth: [] }]
 *     parameters: [{ in: path, name: email, required: true, schema: { type: string } }]
 *     responses: { 200: { description: Cart enabled } }
 */
router.patch("/:email/enable", enableCart);

/**
 * @swagger
 * /api/carts/{email}/disable:
 *   patch:
 *     tags: [Carts]
 *     summary: Disable cart
 *     security: [{ BearerAuth: [] }]
 *     parameters: [{ in: path, name: email, required: true, schema: { type: string } }]
 *     responses: { 200: { description: Cart disabled } }
 */
router.patch("/:email/disable", disableCart);

export default router;
