export interface ErrorInfo {
  type: string;
  message: string;
  category: string;
}

export class ErrorHandler {
  static categorizeError(error: unknown): ErrorInfo {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      return { type: "NETWORK", message: "Network error", category: "network" };
    }
    const msg = error instanceof Error ? error.message : String(error);
    return { type: "UNKNOWN", message: msg, category: "unknown" };
  }

  static logError(error: unknown, context?: Record<string, unknown>): void {
    console.error("Error:", error, "Context:", context);
  }
}
