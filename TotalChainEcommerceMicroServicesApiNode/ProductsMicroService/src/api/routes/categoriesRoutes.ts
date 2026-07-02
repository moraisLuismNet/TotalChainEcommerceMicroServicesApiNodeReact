import { Router } from "express";
import { getAll, getById, create, update, remove } from "../controllers/categoriesController";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware";
import { internalAuthMiddleware } from "../middleware/internalAuthMiddleware";

const router = Router();

router.get("/", getAll);
/**
 * @swagger
 * /api/categories:
 *   get:
 *     tags: [Categories]
 *     summary: Get all categories
 *     responses: { 200: { description: List of categories } }
 */
router.get("/", getAll);
router.get("/:id", internalAuthMiddleware(), getById);
/**
 * @swagger
 * /api/categories:
 *   post:
 *     tags: [Categories]
 *     summary: Create category
 *     security: [{ BearerAuth: [] }]
 *     requestBody: { required: true, content: { application/json: { schema: { type: object, properties: { id: { type: string }, name: { type: string }, description: { type: string }, isActive: { type: boolean } }, required: [id, name] } } } }
 *     responses: { 201: { description: Category created } }
 */
router.post("/", authMiddleware, adminMiddleware, create);
/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     tags: [Categories]
 *     summary: Update category
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     security: [{ BearerAuth: [] }]
 *     requestBody: { required: true, content: { application/json: { schema: { $ref: '#/components/schemas/Category' } } } }
 *     responses: { 200: { description: Category updated } }
 */
router.put("/:id", authMiddleware, adminMiddleware, update);
/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     tags: [Categories]
 *     summary: Delete category
 *     parameters: [{ in: path, name: id, schema: { type: string } }]
 *     security: [{ BearerAuth: [] }]
 *     responses: { 200: { description: Category deleted } }
 */
router.delete("/:id", authMiddleware, adminMiddleware, remove);

export default router;
