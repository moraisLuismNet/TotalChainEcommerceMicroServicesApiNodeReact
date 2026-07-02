import { EmailQueueDTO } from "../../core/dtos/Email/EmailQueueDTO";
import { CreateEmailDTO } from "../../core/dtos/Email/CreateEmailDTO";

export interface IEmailQueueService {
  getAll(): Promise<EmailQueueDTO[]>;
  getById(id: number): Promise<EmailQueueDTO | null>;
  addToQueue(dto: CreateEmailDTO): Promise<EmailQueueDTO>;
  delete(id: number): Promise<boolean>;
  processQueue(): Promise<void>;
}
