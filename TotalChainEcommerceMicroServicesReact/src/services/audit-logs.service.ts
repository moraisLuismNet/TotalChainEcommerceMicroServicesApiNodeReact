import fetchAPI from "../utils/fetch-api";
import { extractData } from "../utils/api-mapper";
import type { IAuditLog } from "../interfaces/ecommerce.interfaces";

export const auditLogsService = {
  getAll: async (): Promise<IAuditLog[]> => {
    const response = await fetchAPI.get<unknown>("audit-logs");
    return extractData<IAuditLog>(response);
  },

  getByEntity: async (entityName: string, entityId: string): Promise<IAuditLog[]> => {
    const response = await fetchAPI.get<unknown>(`audit-logs/${entityName}/${entityId}`);
    return extractData<IAuditLog>(response);
  },
};
