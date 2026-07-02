import { Router } from "express";
import { getAll, getByEmail, create, update, remove } from "../controllers/usersController";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware";
import { internalAuthMiddleware } from "../middleware/internalAuthMiddleware";

const router = Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       401:
 *         description: Unauthorized
 */
router.get("/", authMiddleware, adminMiddleware, getAll);

router.get("/:email", internalAuthMiddleware(), getByEmail);

router.post("/", authMiddleware, adminMiddleware, create);

router.put("/:email", authMiddleware, adminMiddleware, update);

/**
 * @swagger
 * /api/users/{email}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete user
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: User not found
 */
router.delete("/:email", authMiddleware, adminMiddleware, remove);

export default router;
