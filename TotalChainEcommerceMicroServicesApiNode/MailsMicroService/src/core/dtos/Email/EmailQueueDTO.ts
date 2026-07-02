export interface EmailQueueDTO {
  idEmailQueue: number;
  toEmail: string;
  subject: string;
  body: string;
  emailType: string;
  scheduledSendTime: Date;
  sentAt: Date | null;
  errorMessage: string | null;
  createdAt: Date;
  orderId: number | null;
}
