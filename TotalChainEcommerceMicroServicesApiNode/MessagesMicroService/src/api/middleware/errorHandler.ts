import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../../core/helpers/ApiResponse";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error("Error:", err);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json(ApiResponse.error(message, err.errors || []));
};
