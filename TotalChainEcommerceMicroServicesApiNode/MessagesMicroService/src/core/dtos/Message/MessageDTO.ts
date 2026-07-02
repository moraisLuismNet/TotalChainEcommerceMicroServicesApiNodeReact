export interface MessageDTO {
  notificationQueueId: number;
  phoneNumber: string;
  message: string;
  orderId: number | null;
  status: string;
  retryCount: number;
  errorMessage: string | null;
  createdAt: Date;
  sentAt: Date | null;
  scheduledAt: Date;
}
