export interface CreateAuditLogDTO {
  entityName: string;
  entityId: string;
  action: string;
  oldValues?: string | null;
  newValues?: string | null;
  changedBy: string;
}
