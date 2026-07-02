import axios from "axios";
import { getAuthHeaders } from "./HttpUtils";
import { IEmailService } from "../interfaces/IEmailService";
const BASE_URL = process.env.MICROSERVICES_MAILS_API || "http://localhost:5008";
export class HttpEmailService implements IEmailService {
  async sendEmail(to: string, subject: string, body: string): Promise<any> {
    const response = await axios.post(`${BASE_URL}/api/mails/send`, { to, subject, body }, getAuthHeaders());
    return response.data;
  }
}
export default new HttpEmailService();
