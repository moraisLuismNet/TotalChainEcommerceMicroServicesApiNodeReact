import { EmailQueue } from "../../models/EmailQueue";

export interface IEmailQueueRepository {
  getAll(): Promise<EmailQueue[]>;
  getById(id: number): Promise<EmailQueue | null>;
  create(data: { toEmail: string; subject: string; body: string; emailType: string; scheduledSendTime: Date; orderId?: number | null }): Promise<EmailQueue>;
  update(id: number, data: Partial<EmailQueue>): Promise<EmailQueue | null>;
  delete(id: number): Promise<boolean>;
  getPending(): Promise<EmailQueue[]>;
}
