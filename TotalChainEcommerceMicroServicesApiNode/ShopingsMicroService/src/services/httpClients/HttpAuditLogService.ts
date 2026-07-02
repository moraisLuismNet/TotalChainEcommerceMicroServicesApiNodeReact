import { axios, getAuthHeaders } from "./HttpUtils";

const auditLogsApi = process.env.MICROSERVICES_AUDITLOGS_API || "http://localhost:5007";

export class HttpAuditLogService {
  static async sendLog(entityName: string, entityId: string, action: string, oldValues: any, newValues: any, changedBy: string): Promise<void> {
    try {
      await axios.post(`${auditLogsApi}/api/audit-logs`, { entityName, entityId, action, oldValues, newValues, changedBy }, getAuthHeaders());
    } catch (error: any) {
      console.error(`[HttpAuditLogService] failed: ${error.message}`);
    }
  }
}
