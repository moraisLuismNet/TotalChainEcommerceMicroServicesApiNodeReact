import { Router } from "express";
import { getAll, getById, getBySubCategory, create, update, remove } from "../controllers/referencesController";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware";
import { internalAuthMiddleware } from "../middleware/internalAuthMiddleware";

const router = Router();

router.get("/", getAll);
router.get("/by-subcategory/:subCategoryId", getBySubCategory);
router.get("/:id", internalAuthMiddleware(), getById);
router.post("/", authMiddleware, adminMiddleware, create);
router.put("/:id", authMiddleware, adminMiddleware, update);
router.delete("/:id", authMiddleware, adminMiddleware, remove);

export default router;

/**
 * @swagger
 * /api/references:
 *   get:
 *     tags: [References]
 *     summary: Get all references
 *     security: [{ BearerAuth: [] }]
 *     responses: { 200: { description: List of references } }
 *   post:
 *     tags: [References]
 *     summary: Create a reference
 *     security: [{ BearerAuth: [] }]
 *     requestBody: { required: true, content: { application/json: { schema: { $ref: '#/components/schemas/Reference' } } } }
 *     responses: { 201: { description: Reference created } }
 * 
 * /api/references/by-subcategory/{subCategoryId}:
 *   get:
 *     tags: [References]
 *     summary: Get references by subcategory id
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: subCategoryId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of references for the subcategory
 * 
 * /api/references/{id}:
 *   get:
 *     tags: [References]
 *     summary: Get reference by id
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     security: [{ BearerAuth: [] }]
 *     responses: { 200: { description: Reference retrieved } }
 *   put:
 *     tags: [References]
 *     summary: Update a reference
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     security: [{ BearerAuth: [] }]
 *     requestBody: { required: true, content: { application/json: { schema: { $ref: '#/components/schemas/Reference' } } } }
 *     responses: { 200: { description: Reference updated } }
 *   delete:
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     tags: [References]
 *     summary: Delete a reference
 *     security: [{ BearerAuth: [] }]
 *     responses: { 200: { description: Reference deleted } }
 */
