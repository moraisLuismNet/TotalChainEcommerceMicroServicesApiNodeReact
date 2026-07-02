import { Router } from "express";
import { getAll, getById, create, getLink, getSessionStatus, retryFailed, remove } from "../controllers/messagesController";
import { authMiddleware } from "../middleware/authMiddleware";
import { internalAuthMiddleware } from "../middleware/internalAuthMiddleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: WhatsApp notification management
 */

/**
 * @swagger
 * /api/messages:
 *   get:
 *     summary: Get all messages (admin)
 *     tags: [Messages]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of messages
 */
router.get("/", authMiddleware, getAll);

/**
 * @swagger
 * /api/messages/session-status:
 *   get:
 *     summary: Get WhatsApp session status
 *     tags: [Messages]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Session status
 */
router.get("/session-status", authMiddleware, getSessionStatus);

/**
 * @swagger
 * /api/messages/link:
 *   post:
 *     summary: Get WhatsApp pairing link
 *     tags: [Messages]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Pairing link data
 */
router.post("/link", authMiddleware, getLink);

router.post("/retry-failed", authMiddleware, retryFailed);

router.get("/:id", authMiddleware, getById);

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Schedule a WhatsApp notification (inter-service)
 *     tags: [Messages]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *               message:
 *                 type: string
 *               orderId:
 *                 type: integer
 *               scheduledAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Message scheduled
 */
router.post("/", internalAuthMiddleware, create);

router.delete("/:id", authMiddleware, remove);

export default router;
