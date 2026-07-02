import axios from "axios";
import { getAuthHeaders } from "./HttpUtils";

const BASE_URL = process.env.MICROSERVICES_USERS_API || "http://localhost:5001";

export class HttpUserService {
  async getUserByEmail(email: string): Promise<any> {
    try {
      const response = await axios.get(`${BASE_URL}/api/users/${encodeURIComponent(email)}`, getAuthHeaders());
      return response.data;
    } catch {
      return null;
    }
  }
}

export default new HttpUserService();
