import { Request, Response } from "express";
import { AuditLogService } from "../../services/auditLogService";
import { ResponseHelper } from "../../core/helpers/ResponseHelper";

const auditLogService = new AuditLogService();

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const logs = await auditLogService.getAll();
    ResponseHelper.ok(res, logs);
  } catch (error: any) {
    ResponseHelper.error(res, error.message, 500);
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const log = await auditLogService.getById(id);
    if (!log) {
      ResponseHelper.notFound(res, "Audit log not found");
      return;
    }
    ResponseHelper.ok(res, log);
  } catch (error: any) {
    ResponseHelper.error(res, error.message, 500);
  }
};

export const getByEntity = async (req: Request, res: Response): Promise<void> => {
  try {
    const { entityName, entityId } = req.params;
    const logs = await auditLogService.getByEntity(entityName, entityId);
    ResponseHelper.ok(res, logs);
  } catch (error: any) {
    ResponseHelper.error(res, error.message, 500);
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { entity, entityName, action, entityId, details, oldValues, newValues, userEmail, changedBy } = req.body;
    const log = await auditLogService.add({
      entityName: entityName || entity,
      entityId,
      action,
      oldValues: oldValues || details || null,
      newValues: newValues || null,
      changedBy: changedBy || userEmail,
    });
    ResponseHelper.created(res, log);
  } catch (error: any) {
    ResponseHelper.error(res, error.message, 500);
  }
};
