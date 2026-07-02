import { AuditLogDTO } from "../../core/dtos/AuditLog/AuditLogDTO";
import { CreateAuditLogDTO } from "../../core/dtos/AuditLog/CreateAuditLogDTO";

export interface IAuditLogService {
  getAll(): Promise<AuditLogDTO[]>;
  getById(id: number): Promise<AuditLogDTO | null>;
  getByEntity(entityName: string, entityId: string): Promise<AuditLogDTO[]>;
  add(dto: CreateAuditLogDTO): Promise<AuditLogDTO>;
}
