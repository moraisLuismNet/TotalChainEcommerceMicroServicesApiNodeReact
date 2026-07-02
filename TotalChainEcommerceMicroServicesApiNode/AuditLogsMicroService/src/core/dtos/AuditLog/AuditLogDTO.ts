export interface AuditLogDTO {
  id: number;
  entityName: string;
  entityId: string;
  action: string;
  oldValues: string | null;
  newValues: string | null;
  changedBy: string;
  changedAt: Date;
}
