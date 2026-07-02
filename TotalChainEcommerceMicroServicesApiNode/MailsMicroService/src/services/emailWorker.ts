import { EmailQueueService } from "./emailQueueService";

class EmailWorker {
  private intervalId: NodeJS.Timeout | null = null;
  private emailQueueService: EmailQueueService;

  constructor() {
    this.emailQueueService = new EmailQueueService();
  }

  start(): void {
    console.log("EmailWorker started (interval: 5 minutes)");
    this.process();
    this.intervalId = setInterval(() => this.process(), 5 * 60 * 1000);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private async process(): Promise<void> {
    try {
      await this.emailQueueService.processQueue();
    } catch (error) {
      console.error("EmailWorker process error:", error);
    }
  }
}

const emailWorker = new EmailWorker();
export default emailWorker;
