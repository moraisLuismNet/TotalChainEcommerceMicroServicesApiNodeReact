import { axios, getAuthHeaders } from "./HttpUtils";

const usersApi = process.env.MICROSERVICES_USERS_API || "http://localhost:5001";

export class HttpUserService {
  static async getUserByEmail(email: string): Promise<any> {
    try {
      const response = await axios.get(`${usersApi}/api/users/${email}`, getAuthHeaders());
      return response.data?.data;
    } catch (error: any) {
      console.error(`[HttpUserService] failed: ${error.message}`);
      return null;
    }
  }
}
