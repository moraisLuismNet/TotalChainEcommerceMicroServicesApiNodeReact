import { IEmailQueueService } from "./interfaces/IEmailQueueService";
import { IEmailQueueRepository } from "../database/repositories/interfaces/IEmailQueueRepository";
import { EmailQueueRepository } from "../database/repositories/EmailQueueRepository";
import { BrevoEmailProvider } from "./brevoEmailProvider";
import { EmailQueueDTO } from "../core/dtos/Email/EmailQueueDTO";
import { CreateEmailDTO } from "../core/dtos/Email/CreateEmailDTO";

export class EmailQueueService implements IEmailQueueService {
  private repository: IEmailQueueRepository;
  private emailProvider: BrevoEmailProvider;

  constructor() {
    this.repository = new EmailQueueRepository();
    this.emailProvider = new BrevoEmailProvider();
  }

  async getAll(): Promise<EmailQueueDTO[]> {
    const emails = await this.repository.getAll();
    return emails.map((e) => this.toDTO(e));
  }

  async getById(id: number): Promise<EmailQueueDTO | null> {
    const email = await this.repository.getById(id);
    return email ? this.toDTO(email) : null;
  }

  async addToQueue(dto: CreateEmailDTO): Promise<EmailQueueDTO> {
    const email = await this.repository.create({
      toEmail: dto.toEmail,
      subject: dto.subject,
      body: dto.body,
      emailType: dto.emailType || "general",
      scheduledSendTime: dto.scheduledSendTime || new Date(),
      orderId: dto.orderId || null,
    });
    // Send immediately via Brevo
    const sent = await this.emailProvider.sendEmail(dto.toEmail, dto.subject, dto.body);
    const updateData: any = sent ? { sentAt: new Date() } : { errorMessage: "Failed to send" };
    const updated = await this.repository.update(email.idEmailQueue, updateData);
    return this.toDTO(updated || email);
  }

  async delete(id: number): Promise<boolean> {
    return this.repository.delete(id);
  }

  async processQueue(): Promise<void> {
    const pending = await this.repository.getPending();
    for (const email of pending) {
      const sent = await this.emailProvider.sendEmail(email.toEmail, email.subject, email.body);
      if (sent) {
        await this.repository.update(email.idEmailQueue, { sentAt: new Date() } as any);
      } else {
        await this.repository.update(email.idEmailQueue, { errorMessage: "Failed to send" } as any);
      }
    }
  }

  private toDTO(email: any): EmailQueueDTO {
    return {
      idEmailQueue: email.idEmailQueue,
      toEmail: email.toEmail,
      subject: email.subject,
      body: email.body,
      emailType: email.emailType,
      scheduledSendTime: email.scheduledSendTime,
      sentAt: email.sentAt,
      errorMessage: email.errorMessage,
      createdAt: email.createdAt,
      orderId: email.orderId,
    };
  }
}
