import { Router } from "express";
import { getAll, getById, getByEntity, create } from "../controllers/auditLogController";
import { authMiddleware } from "../middleware/authMiddleware";
import { internalAuthMiddleware } from "../middleware/internalAuthMiddleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: AuditLogs
 *   description: Audit log management
 */

/**
 * @swagger
 * /api/audit-logs:
 *   get:
 *     tags: [AuditLogs]
 *     summary: Get all audit logs (admin)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of audit logs
 */
router.get("/", authMiddleware, getAll);

router.get("/:id", authMiddleware, getById);

/**
 * @swagger
 * /api/audit-logs/{entityName}/{entityId}:
 *   get:
 *     tags: [AuditLogs]
 *     summary: Get audit logs by entity (inter-service)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: entityName
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: entityId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of audit logs for entity
 */
router.get("/:entityName/:entityId", internalAuthMiddleware, getByEntity);

router.post("/", internalAuthMiddleware, create);

export default router;
