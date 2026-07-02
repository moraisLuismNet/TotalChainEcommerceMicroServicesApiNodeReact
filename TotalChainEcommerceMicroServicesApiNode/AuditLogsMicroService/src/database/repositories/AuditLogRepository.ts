import { AuditLog } from "../models/AuditLog";
import { IAuditLogRepository } from "./interfaces/IAuditLogRepository";

export class AuditLogRepository implements IAuditLogRepository {
  async getAll(): Promise<AuditLog[]> {
    return AuditLog.findAll({ order: [["changedAt", "DESC"]] });
  }

  async getById(id: number): Promise<AuditLog | null> {
    return AuditLog.findByPk(id);
  }

  async getByEntity(entityName: string, entityId: string): Promise<AuditLog[]> {
    return AuditLog.findAll({ where: { entityName, entityId }, order: [["changedAt", "DESC"]] });
  }

  async create(data: { entityName: string; entityId: string; action: string; oldValues?: string | null; newValues?: string | null; changedBy: string }): Promise<AuditLog> {
    return AuditLog.create(data as any);
  }
}
