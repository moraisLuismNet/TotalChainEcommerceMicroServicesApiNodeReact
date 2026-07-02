import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, data: null, message: "Too many requests", errors: ["Rate limit exceeded"] },
  standardHeaders: true,
  legacyHeaders: false,
});
