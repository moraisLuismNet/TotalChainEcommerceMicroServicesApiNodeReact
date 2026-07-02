export interface CreateEmailDTO {
  toEmail: string;
  subject: string;
  body: string;
  emailType?: string;
  scheduledSendTime?: Date;
  orderId?: number;
}
