import { Request, Response, NextFunction } from "express";
const clients = new Map<string, { count: number; resetAt: number }>();
const maxRequests = parseInt(process.env.RATE_LIMIT_MAX || "100");
const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES || "1") * 60 * 1000;
export function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const clientIp = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  let entry = clients.get(clientIp);
  if (!entry || now >= entry.resetAt) {
    entry = { count: 0, resetAt: now + windowMs };
    clients.set(clientIp, entry);
  }
  entry.count++;
  if (entry.count > maxRequests) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    res.set("Retry-After", String(retryAfter));
    return res.status(429).json({ success: false, message: "Too many requests. Please try agin later.", statusCode: 429 });
  }
  next();
}
