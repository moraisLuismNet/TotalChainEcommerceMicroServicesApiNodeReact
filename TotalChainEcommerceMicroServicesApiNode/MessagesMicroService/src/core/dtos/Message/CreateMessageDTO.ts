export interface CreateMessageDTO {
  phoneNumber: string;
  message: string;
  orderId?: number;
  scheduledAt?: Date;
}
