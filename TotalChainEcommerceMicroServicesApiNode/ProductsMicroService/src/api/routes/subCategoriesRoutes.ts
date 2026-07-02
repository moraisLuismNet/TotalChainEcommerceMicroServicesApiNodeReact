import { Router } from "express";
import { getAll, getById, getByCategory, create, update, remove } from "../controllers/subCategoriesController";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware";
import { internalAuthMiddleware } from "../middleware/internalAuthMiddleware";

const router = Router();

router.get("/", getAll);
router.get("/by-category/:categoryId", getByCategory);
router.get("/:id", internalAuthMiddleware(), getById);
router.post("/", authMiddleware, adminMiddleware, create);
router.put("/:id", authMiddleware, adminMiddleware, update);
router.delete("/:id", authMiddleware, adminMiddleware, remove);

export default router;

/**
 * @swagger
 * /api/subcategories:
 *   get:
 *     tags: [SubCategories]
 *     summary: Get all subcategories
 *     security: [{ BearerAuth: [] }]
 *     responses: { 200: { description: List of subcategories } }
 *   post:
 *     tags: [SubCategories]
 *     summary: Create a subcategory
 *     security: [{ BearerAuth: [] }]
 *     requestBody: { required: true, content: { application/json: { schema: { $ref: '#/components/schemas/SubCategory' } } } }
 *     responses: { 201: { description: SubCategory created } }
 * 
 * /api/subcategories/by-category/{categoryId}:
 *   get:
 *     tags: [SubCategories]
 *     summary: Get subcategories by category id
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of subcategories for the category
 * 
 * /api/subcategories/{id}:
 *   get:
 *     tags: [SubCategories]
 *     summary: Get subcategory by id
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     security: [{ BearerAuth: [] }]
 *     responses: { 200: { description: SubCategory retrieved } }
 *   put:
 *     tags: [SubCategories]
 *     summary: Update a subcategory
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     security: [{ BearerAuth: [] }]
 *     requestBody: { required: true, content: { application/json: { schema: { $ref: '#/components/schemas/SubCategory' } } } }
 *     responses: { 200: { description: SubCategory updated } }
 *   delete:
 *     tags: [SubCategories]
 *     summary: Delete a subcategory
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     security: [{ BearerAuth: [] }]
 *     responses: { 200: { description: SubCategory deleted } }
 */
