import axios from "axios";
import { getAuthHeaders } from "./HttpUtils";
const BASE_URL = process.env.MICROSERVICES_AUDITLOGS_API || "http://localhost:5007";
export class HttpAuditLogService {
  async sendLog(action: string, entity: string, entityId: string | number, details: string, userEmail: string): Promise<any> {
    const response = await axios.post(`${BASE_URL}/api/audit-logs`, { action, entity, entityId, details, userEmail }, getAuthHeaders());
    return response.data;
  }
}
export default new HttpAuditLogService();
