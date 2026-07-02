import { Response } from "express";
import { ApiResponse } from "./ApiResponse";
export class ResponseHelper {
  static success<T>(res: Response, message: string, data?: T, statusCode: number = 200) {
    const response: ApiResponse<T> = { success: true, message, data, statusCode };
    return res.status(statusCode).json(response);
  }
  static error(res: Response, message: string, error?: string, statusCode: number = 500) {
    const response: ApiResponse = { success: false, message, errors: error ? [error] : [], statusCode };
    return res.status(statusCode).json(response);
  }
  static created<T>(res: Response, message: string, data: T) { return res.status(201).json({ success: true, message, data, statusCode: 201 }); }
  static badRequest(res: Response, message: string, errors?: string[]) { return res.status(400).json({ success: false, message, errors: errors || [], statusCode: 400 }); }
  static unauthorized(res: Response, message: string = "Unauthorized") { return res.status(401).json({ success: false, message, statusCode: 401 }); }
  static forbidden(res: Response, message: string = "Forbidden") { return res.status(403).json({ success: false, message, statusCode: 403 }); }
  static notFound(res: Response, message: string = "Resource not found") { return res.status(404).json({ success: false, message, statusCode: 404 }); }
}
