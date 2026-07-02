import { Op } from "sequelize";
import { EmailQueue } from "../models/EmailQueue";
import { IEmailQueueRepository } from "./interfaces/IEmailQueueRepository";

export class EmailQueueRepository implements IEmailQueueRepository {
  async getAll(): Promise<EmailQueue[]> {
    return EmailQueue.findAll({ order: [["createdAt", "DESC"]] });
  }

  async getById(id: number): Promise<EmailQueue | null> {
    return EmailQueue.findByPk(id);
  }

  async create(data: { toEmail: string; subject: string; body: string; emailType: string; scheduledSendTime: Date; orderId?: number | null }): Promise<EmailQueue> {
    return EmailQueue.create(data as any);
  }

  async update(id: number, data: Partial<EmailQueue>): Promise<EmailQueue | null> {
    const record = await this.getById(id);
    if (!record) return null;
    await record.update(data);
    return record;
  }

  async delete(id: number): Promise<boolean> {
    const record = await this.getById(id);
    if (!record) return false;
    await record.destroy();
    return true;
  }

  async getPending(): Promise<EmailQueue[]> {
    return EmailQueue.findAll({
      where: {
        sentAt: null,
        scheduledSendTime: { [Op.lte]: new Date() },
      },
      order: [["scheduledSendTime", "ASC"]],
    });
  }
}
