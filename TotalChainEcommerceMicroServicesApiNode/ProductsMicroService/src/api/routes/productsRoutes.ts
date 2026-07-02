import { Router } from "express";
import { getAll, getById, getByReferenceId, searchByName, create, update, remove, partialStockUpdate } from "../controllers/productsController";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware";
import { internalAuthMiddleware } from "../middleware/internalAuthMiddleware";

const router = Router();

router.get("/", getAll);
router.get("/by-reference/:referenceId", getByReferenceId);
router.get("/search/name/:text", searchByName);
router.get("/:id", internalAuthMiddleware(), getById);
router.post("/", authMiddleware, adminMiddleware, create);
router.put("/:id", authMiddleware, adminMiddleware, update);
router.patch("/:id/stock", authMiddleware, partialStockUpdate);
router.delete("/:id", authMiddleware, adminMiddleware, remove);

export default router;

/**
 * @swagger
 * /api/products:
 *   get:
 *     tags: [Products]
 *     summary: Get all products
 *     responses: { 200: { description: List of products } }
 *   post:
 *     tags: [Products]
 *     summary: Create a product
 *     security: [{ BearerAuth: [] }]
 *     requestBody: { required: true, content: { application/json: { schema: { $ref: '#/components/schemas/Product' } } } }
 *     responses: { 201: { description: Product created } }
 * 
 * /api/products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Get product by id
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     responses: { 200: { description: Product retrieved } }
 *   put:
 *     tags: [Products]
 *     summary: Update a product
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     security: [{ BearerAuth: [] }]
 *     requestBody: { required: true, content: { application/json: { schema: { $ref: '#/components/schemas/Product' } } } }
 *     responses: { 200: { description: Product updated } }
 *   delete:
 *     tags: [Products]
 *     summary: Delete a product
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     security: [{ BearerAuth: [] }]
 *     responses: { 200: { description: Product deleted } }
 * /api/products/by-reference/{referenceId}:
 *   get:
 *     tags: [Products]
 *     parameters: [{ in: path, name: referenceId, required: true, schema: { type: string } }]
 *     summary: Get products by reference id
 *     responses: { 200: { description: Products found } }
 * /api/products/{id}/stock:
 *   patch:
 *     tags: [Products]
 *     summary: Update product stock
 *     security: [{ BearerAuth: [] }]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     requestBody: { required: true, content: { application/json: { schema: { type: object, properties: { quantity: { type: integer }, warehouse: { type: string } } } } } }
 *     responses: { 200: { description: Stock updated } }
 */
