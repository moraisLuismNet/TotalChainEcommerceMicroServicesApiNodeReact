import { NotificationQueue } from "../../models/NotificationQueue";

export interface INotificationQueueRepository {
  getAll(): Promise<NotificationQueue[]>;
  getById(id: number): Promise<NotificationQueue | null>;
  create(data: { phoneNumber: string; message: string; orderId?: number | null; scheduledAt: Date }): Promise<NotificationQueue>;
  update(id: number, data: Partial<NotificationQueue>): Promise<NotificationQueue | null>;
  delete(id: number): Promise<boolean>;
  getPending(): Promise<NotificationQueue[]>;
  resetFailedToPending(): Promise<number>;
}
