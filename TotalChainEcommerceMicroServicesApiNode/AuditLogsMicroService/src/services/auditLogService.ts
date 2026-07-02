import { IAuditLogService } from "./interfaces/IAuditLogService";
import { IAuditLogRepository } from "../database/repositories/interfaces/IAuditLogRepository";
import { AuditLogRepository } from "../database/repositories/AuditLogRepository";
import { AuditLogDTO } from "../core/dtos/AuditLog/AuditLogDTO";
import { CreateAuditLogDTO } from "../core/dtos/AuditLog/CreateAuditLogDTO";

export class AuditLogService implements IAuditLogService {
  private repository: IAuditLogRepository;

  constructor() {
    this.repository = new AuditLogRepository();
  }

  async getAll(): Promise<AuditLogDTO[]> {
    const logs = await this.repository.getAll();
    return logs.map((log) => this.toDTO(log));
  }

  async getById(id: number): Promise<AuditLogDTO | null> {
    const log = await this.repository.getById(id);
    return log ? this.toDTO(log) : null;
  }

  async getByEntity(entityName: string, entityId: string): Promise<AuditLogDTO[]> {
    const logs = await this.repository.getByEntity(entityName, entityId);
    return logs.map((log) => this.toDTO(log));
  }

  async add(dto: CreateAuditLogDTO): Promise<AuditLogDTO> {
    const log = await this.repository.create({
      entityName: dto.entityName,
      entityId: dto.entityId,
      action: dto.action,
      oldValues: dto.oldValues || null,
      newValues: dto.newValues || null,
      changedBy: dto.changedBy,
    });
    return this.toDTO(log);
  }

  private toDTO(log: any): AuditLogDTO {
    return {
      id: log.id,
      entityName: log.entityName,
      entityId: log.entityId,
      action: log.action,
      oldValues: log.oldValues,
      newValues: log.newValues,
      changedBy: log.changedBy,
      changedAt: log.changedAt,
    };
  }
}
