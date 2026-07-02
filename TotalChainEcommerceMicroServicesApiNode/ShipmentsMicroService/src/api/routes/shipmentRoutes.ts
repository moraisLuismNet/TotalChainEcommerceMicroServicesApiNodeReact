import { Router } from "express";
import ShipmentController from "../controllers/shipmentController";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware";
import internalAuthMiddleware from "../middleware/internalAuthMiddleware";
const router = Router();
/**
 * @swagger
 * /api/shipments:
 *   get:
 *     summary: Get all shipments
 *     tags: [Shipments]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Shipments retrieved
 */

/**
 * @swagger
 * /api/shipments/tracking/{trackingNumber}:
 *   get:
 *     summary: Get shipment by tracking number
 *     tags: [Shipments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trackingNumber
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Shipment retrieved
 *       404:
 *         description: Shipment not found
 */

/**
 * @swagger
 * /api/shipments/my:
 *   get:
 *     summary: Get my shipments
 *     tags: [Shipments]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Shipments retrieved
 */

/**
 * @swagger
 * /api/shipments/order/{orderId}:
 *   get:
 *     summary: Get shipment by order ID
 *     tags: [Shipments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Shipment retrieved
 */
router.get("/", authMiddleware, adminMiddleware, ShipmentController.getAll);
router.get("/tracking/:trackingNumber", authMiddleware, ShipmentController.getByTrackingNumber);
router.get("/my", authMiddleware, ShipmentController.getMyShipments);
router.get("/:id", authMiddleware, ShipmentController.getById);
router.get("/order/:orderId", internalAuthMiddleware(), ShipmentController.getByOrderId);
router.post("/", internalAuthMiddleware(), ShipmentController.create);
router.patch("/:id/status", authMiddleware, adminMiddleware, ShipmentController.updateStatus);
export default router;
