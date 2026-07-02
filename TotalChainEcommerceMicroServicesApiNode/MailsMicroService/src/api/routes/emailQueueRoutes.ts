import { Router } from "express";
import { getAll, getById, create, remove } from "../controllers/emailQueueController";
import { authMiddleware } from "../middleware/authMiddleware";
import { internalAuthMiddleware } from "../middleware/internalAuthMiddleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Mails
 *   description: Email queue management
 */

/**
 * @swagger
 * /api/mails:
 *   get:
 *     summary: Get all emails (admin)
 *     tags: [Mails]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of emails
 */
router.get("/", authMiddleware, getAll);

router.get("/:id", authMiddleware, getById);

/**
 * @swagger
 * /api/mails:
 *   post:
 *     summary: Queue an email (inter-service)
 *     tags: [Mails]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               toEmail:
 *                 type: string
 *               subject:
 *                 type: string
 *               body:
 *                 type: string
 *               emailType:
 *                 type: string
 *               scheduledSendTime:
 *                 type: string
 *                 format: date-time
 *               orderId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Email queued
 */
router.post("/", internalAuthMiddleware, create);

router.delete("/:id", authMiddleware, remove);

export default router;
