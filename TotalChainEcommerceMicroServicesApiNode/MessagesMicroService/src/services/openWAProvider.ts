import axios from "axios";
import { IWhatsAppProvider } from "./interfaces/IWhatsAppProvider";
import dotenv from "dotenv";
dotenv.config();

export class OpenWAProvider implements IWhatsAppProvider {
  private baseUrl: string;
  private apiKey: string;
  private sessionId: string;

  constructor() {
    this.baseUrl = process.env.OPENWA_BASE_URL || "http://localhost:2785/api";
    this.apiKey = process.env.OPENWA_API_KEY || "";
    this.sessionId = process.env.OPENWA_SESSION_ID || "";
  }

  private authHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
    };
  }

  async sendMessage(phoneNumber: string, message: string): Promise<boolean> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/sessions/${this.sessionId}/messages/send-text`,
        { chatId: `${phoneNumber}@c.us`, text: message },
        { headers: this.authHeaders() }
      );
      return response.status === 200 || response.status === 201;
    } catch (error) {
      console.error("OpenWA send error:", error);
      return false;
    }
  }

  async getLink(): Promise<any> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/sessions/${this.sessionId}/start`,
        {},
        { headers: this.authHeaders() }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400 && error.response?.data?.message?.includes("already started")) {
        return { alreadyLinked: true, message: "Session is already started" };
      }
      throw error;
    }
  }

  async getSessionStatus(): Promise<any> {
    const response = await axios.get(
      `${this.baseUrl}/sessions/${this.sessionId}`,
      { headers: this.authHeaders() }
    );
    return response.data;
  }
}