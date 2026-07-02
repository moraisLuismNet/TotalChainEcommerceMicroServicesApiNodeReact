import { Request, Response, NextFunction } from "express";
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error("Unhandled error:", err.message);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  res.status(statusCode).json({ success: false, message, errors: err.errors || [message], statusCode });
}
