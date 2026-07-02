import { NotificationService } from "./notificationService";

class NotificationWorker {
  private intervalId: NodeJS.Timeout | null = null;
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  start(): void {
    console.log("NotificationWorker started (interval: 15 seconds)");
    this.process();
    this.intervalId = setInterval(() => this.process(), 15 * 1000);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private async process(): Promise<void> {
    try {
      await this.notificationService.processQueue();
    } catch (error) {
      console.error("NotificationWorker process error:", error);
    }
  }
}

const notificationWorker = new NotificationWorker();
export default notificationWorker;
