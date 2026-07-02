import { Router } from "express";
import { getAll, getById, getByProductId, create, update, remove, reserveStock, releaseStock, addStock, removeStock } from "../controllers/stocksController";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware";
import { internalAuthMiddleware } from "../middleware/internalAuthMiddleware";

const router = Router();

router.get("/", authMiddleware, adminMiddleware, getAll);
router.get("/product/:productId", authMiddleware, getByProductId);
router.get("/:id", authMiddleware, getById);
router.post("/", authMiddleware, adminMiddleware, create);
router.put("/:id", authMiddleware, adminMiddleware, update);
router.delete("/:id", authMiddleware, adminMiddleware, remove);
router.post("/reserve", internalAuthMiddleware(), reserveStock);
router.post("/release", internalAuthMiddleware(), releaseStock);
router.post("/add", internalAuthMiddleware(), addStock);
router.post("/remove", internalAuthMiddleware(), removeStock);

export default router;

/**
 * @swagger
 * /api/stocks:
 *   get:
 *     tags: [Stocks]
 *     summary: Get all stocks
 *     security: [{ BearerAuth: [] }]
 *     responses: { 200: { description: List of stocks } }
 *   post:
 *     tags: [Stocks]
 *     summary: Create a stock entry
 *     security: [{ BearerAuth: [] }]
 *     responses: { 201: { description: Stock entry created } }
 * 
 * /api/stocks/{id}:
 *   get:
 *     tags: [Stocks]
 *     summary: Get stock by id
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     security: [{ BearerAuth: [] }]
 *     responses: { 200: { description: Stock retrieved } }
 *   put:
 *     tags: [Stocks]
 *     summary: Update stock
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     security: [{ BearerAuth: [] }]
 *     requestBody: { required: true, content: { application/json: { schema: { type: object, properties: { quantity: { type: number } } } } } }
 *     responses: { 200: { description: Stock updated } }
 *   delete:
 *     tags: [Stocks]
 *     summary: Delete stock
 *     parameters: [{ in: path, name: id, required: true, schema: { type: file } }]
 *     security: [{ BearerAuth: [] }]
 *     responses: { 200: { description: Stock deleted } }
 * 
 * /api/stocks/product/{productId}:
 *   get:
 *     tags: [Stocks]
 *     summary: Get stocks by product id
 *     security: [{ BearerAuth: [] }]
 *     parameters: [{ in: path, name: productId, required: true, schema: { type: string }, description: "Product id" }]
 *     responses: { 200: { description: List of stocks } }
 */
