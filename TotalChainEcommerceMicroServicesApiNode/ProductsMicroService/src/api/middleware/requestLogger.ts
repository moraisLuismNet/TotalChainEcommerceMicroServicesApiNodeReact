import { Request, Response, NextFunction } from "express";
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  res.on("finish", () => {
    const elapsed = Date.now() - start;
    if (req.originalUrl.startsWith("/api")) {
      console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${elapsed}ms`);
    }
  });
  next();
}
