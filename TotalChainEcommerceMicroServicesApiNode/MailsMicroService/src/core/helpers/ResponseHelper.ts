import { Response } from "express";
import { ApiResponse } from "./ApiResponse";

export class ResponseHelper {
  public static send<T>(res: Response, apiResponse: ApiResponse<T>, statusCode: number = 200): void {
    res.status(statusCode).json(apiResponse);
  }

  public static ok<T>(res: Response, data: T, message?: string): void {
    ResponseHelper.send(res, ApiResponse.ok(data, message));
  }

  public static created<T>(res: Response, data: T, message?: string): void {
    ResponseHelper.send(res, ApiResponse.created(data, message), 201);
  }

  public static error(res: Response, message: string, statusCode: number = 400, errors: string[] = []): void {
    ResponseHelper.send(res, ApiResponse.error(message, errors), statusCode);
  }

  public static notFound(res: Response, message?: string): void {
    ResponseHelper.send(res, ApiResponse.notFound(message), 404);
  }
}
