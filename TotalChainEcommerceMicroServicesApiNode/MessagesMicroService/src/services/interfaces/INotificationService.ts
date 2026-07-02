import { MessageDTO } from "../../core/dtos/Message/MessageDTO";
import { CreateMessageDTO } from "../../core/dtos/Message/CreateMessageDTO";

export interface INotificationService {
  getAll(): Promise<MessageDTO[]>;
  getById(id: number): Promise<MessageDTO | null>;
  scheduleNotification(dto: CreateMessageDTO): Promise<MessageDTO>;
  delete(id: number): Promise<boolean>;
  processQueue(): Promise<void>;
}
