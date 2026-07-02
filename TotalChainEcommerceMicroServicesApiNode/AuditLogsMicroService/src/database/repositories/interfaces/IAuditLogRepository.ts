import { AuditLog } from "../../models/AuditLog";

export interface IAuditLogRepository {
  getAll(): Promise<AuditLog[]>;
  getById(id: number): Promise<AuditLog | null>;
  getByEntity(entityName: string, entityId: string): Promise<AuditLog[]>;
  create(data: { entityName: string; entityId: string; action: string; oldValues?: string | null; newValues?: string | null; changedBy: string }): Promise<AuditLog>;
}
