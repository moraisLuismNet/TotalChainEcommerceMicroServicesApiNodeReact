import { Op } from "sequelize";
import { NotificationQueue } from "../models/NotificationQueue";
import { INotificationQueueRepository } from "./interfaces/INotificationQueueRepository";

export class NotificationQueueRepository implements INotificationQueueRepository {
  async getAll(): Promise<NotificationQueue[]> {
    return NotificationQueue.findAll({ order: [["createdAt", "DESC"]] });
  }

  async getById(id: number): Promise<NotificationQueue | null> {
    return NotificationQueue.findByPk(id);
  }

  async create(data: { phoneNumber: string; message: string; orderId?: number | null; scheduledAt: Date }): Promise<NotificationQueue> {
    return NotificationQueue.create(data as any);
  }

  async update(id: number, data: Partial<NotificationQueue>): Promise<NotificationQueue | null> {
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

  async getPending(): Promise<NotificationQueue[]> {
    return NotificationQueue.findAll({
      where: {
        status: "Pending",
        scheduledAt: { [Op.lte]: new Date() },
      },
      order: [["scheduledAt", "ASC"]],
    });
  }

  async resetFailedToPending(): Promise<number> {
    const [count] = await NotificationQueue.update(
      { status: "Pending", retryCount: 0, errorMessage: null },
      { where: { status: "Failed" } }
    );
    return count;
  }
}
