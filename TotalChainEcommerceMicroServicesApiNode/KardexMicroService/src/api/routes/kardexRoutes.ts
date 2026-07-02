import { Router } from "express";
import KardexController from "../controllers/kardexController";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware";
import internalAuthMiddleware from "../middleware/internalAuthMiddleware";
const router = Router();
/**
 * @swagger
 * /api/kardex:
 *   get:
 *     summary: Get all kardex entries
 *     tags: [Kardex]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Kardex entries retrieved
 */
router.get("/", authMiddleware, adminMiddleware, KardexController.getAll);
/**
 * @swagger
 * /api/kardex/product/{productId}:
 *   get:
 *     summary: Get kardex entries by product ID
 *     tags: [Kardex]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Kardex entries retrieved
 */
router.get("/product/:productId", internalAuthMiddleware(), KardexController.getByProductId);
router.get("/:id", authMiddleware, adminMiddleware, KardexController.getById);

/**
 * @swagger
 * /api/kardex/entry:
 *   post:
 *     tags: [Kardex]
 *     summary: Register a kardex entry (stock in)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ProductId: { type: string }
 *               Quantity: { type: integer }
 *               StockBefore: { type: integer }
 *               StockAfter: { type: integer }
 *     responses:
 *       201:
 *         description: Kardex entry created
 */

/**
 * @swagger
 * /api/kardex/exit:
 *   post:
 *     tags: [Kardex]
 *     summary: Register a kardex exit (stock out)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ProductId: { type: string }
 *               Quantity: { type: integer }
 *               StockBefore: { type: integer }
 *               StockAfter: { type: integer }
 *     responses:
 *       201:
 *         description: Kardex exit created
 */
router.post("/entry", internalAuthMiddleware(), KardexController.createEntry);
router.post("/exit", internalAuthMiddleware(), KardexController.createExit);
router.delete("/:id", authMiddleware, adminMiddleware, KardexController.delete);
export default router;
