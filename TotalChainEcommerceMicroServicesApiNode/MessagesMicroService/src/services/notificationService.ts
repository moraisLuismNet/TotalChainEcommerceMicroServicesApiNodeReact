import { INotificationService } from "./interfaces/INotificationService";
import { INotificationQueueRepository } from "../database/repositories/interfaces/INotificationQueueRepository";
import { NotificationQueueRepository } from "../database/repositories/NotificationQueueRepository";
import { OpenWAProvider } from "./openWAProvider";
import { MessageDTO } from "../core/dtos/Message/MessageDTO";
import { CreateMessageDTO } from "../core/dtos/Message/CreateMessageDTO";

export class NotificationService implements INotificationService {
  private repository: INotificationQueueRepository;
  private whatsAppProvider: OpenWAProvider;

  constructor() {
    this.repository = new NotificationQueueRepository();
    this.whatsAppProvider = new OpenWAProvider();
  }

  async getAll(): Promise<MessageDTO[]> {
    const notifications = await this.repository.getAll();
    return notifications.map((n) => this.toDTO(n));
  }

  async getById(id: number): Promise<MessageDTO | null> {
    const notification = await this.repository.getById(id);
    return notification ? this.toDTO(notification) : null;
  }

  async scheduleNotification(dto: CreateMessageDTO): Promise<MessageDTO> {
    const notification = await this.repository.create({
      phoneNumber: dto.phoneNumber,
      message: dto.message,
      orderId: dto.orderId || null,
      scheduledAt: dto.scheduledAt || new Date(),
    });
    return this.toDTO(notification);
  }

  async retryFailed(): Promise<number> {
    return this.repository.resetFailedToPending();
  }

  async delete(id: number): Promise<boolean> {
    return this.repository.delete(id);
  }

  async processQueue(): Promise<void> {
    const pending = await this.repository.getPending();
    for (const notification of pending) {
      const sent = await this.whatsAppProvider.sendMessage(notification.phoneNumber, notification.message);
      if (sent) {
        await this.repository.update(notification.notificationQueueId, { status: "Sent", sentAt: new Date() } as any);
      } else {
        const retryCount = (notification.retryCount || 0) + 1;
        const updateData: any = { retryCount };
        if (retryCount >= 3) {
          updateData.status = "Failed";
          updateData.errorMessage = "Max retries reached";
        } else {
          updateData.status = "Pending";
          updateData.errorMessage = "Send failed, will retry";
        }
        await this.repository.update(notification.notificationQueueId, updateData);
      }
    }
  }

  async getLink(): Promise<any> {
    return this.whatsAppProvider.getLink();
  }

  async getSessionStatus(): Promise<any> {
    return this.whatsAppProvider.getSessionStatus();
  }

  private toDTO(notification: any): MessageDTO {
    return {
      notificationQueueId: notification.notificationQueueId,
      phoneNumber: notification.phoneNumber,
      message: notification.message,
      orderId: notification.orderId,
      status: notification.status,
      retryCount: notification.retryCount,
      errorMessage: notification.errorMessage,
      createdAt: notification.createdAt,
      sentAt: notification.sentAt,
      scheduledAt: notification.scheduledAt,
    };
  }
}
