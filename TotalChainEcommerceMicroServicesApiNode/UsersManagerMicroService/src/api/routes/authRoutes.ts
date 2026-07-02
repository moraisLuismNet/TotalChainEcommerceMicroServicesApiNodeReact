import { Router } from "express";
import { login, register, changePassword, getProfile } from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Bad request
 */
router.post("/login", login);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, name, password]
 *             properties:
 *               email: { type: string }
 *               name: { type: string }
 *               password: { type: string }
 *               role: { type: string }
 *     responses:
 *       201:
 *         description: Registration successful
 *       400:
 *         description: Bad request
 */
router.post("/register", register);

router.post("/change-password", authMiddleware, changePassword);

router.get("/profile", authMiddleware, getProfile);

export default router;
