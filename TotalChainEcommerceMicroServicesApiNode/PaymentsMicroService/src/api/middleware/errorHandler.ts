import { Request, Response, NextFunction } from "express";
import { ResponseHelper } from "../../core/helpers/ResponseHelper";
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  console.error("Error:", err.message);
  ResponseHelper.error(res, "Internal server error", err.message, 500);
}
