import { Request, Response } from "express";
import { NotificationService } from "../../services/notificationService";
import { ResponseHelper } from "../../core/helpers/ResponseHelper";

const notificationService = new NotificationService();

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const messages = await notificationService.getAll();
    ResponseHelper.ok(res, messages);
  } catch (error: any) {
    ResponseHelper.error(res, error.message, 500);
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const message = await notificationService.getById(id);
    if (!message) {
      ResponseHelper.notFound(res, "Message not found");
      return;
    }
    ResponseHelper.ok(res, message);
  } catch (error: any) {
    ResponseHelper.error(res, error.message, 500);
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const message = await notificationService.scheduleNotification(req.body);
    ResponseHelper.created(res, message);
  } catch (error: any) {
    ResponseHelper.error(res, error.message, 500);
  }
};

export const getLink = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await notificationService.getLink();
    ResponseHelper.ok(res, data);
  } catch (error: any) {
    ResponseHelper.error(res, error.message, 500);
  }
};

export const getSessionStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await notificationService.getSessionStatus();
    ResponseHelper.ok(res, data);
  } catch (error: any) {
    ResponseHelper.error(res, error.message, 500);
  }
};

export const retryFailed = async (req: Request, res: Response): Promise<void> => {
  try {
    const count = await notificationService.retryFailed();
    ResponseHelper.ok(res, { resetCount: count }, `${count} messages reset to Pending`);
  } catch (error: any) {
    ResponseHelper.error(res, error.message, 500);
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await notificationService.delete(id);
    if (!deleted) {
      ResponseHelper.notFound(res, "Message not found");
      return;
    }
    ResponseHelper.ok(res, null, "Message deleted successfully");
  } catch (error: any) {
    ResponseHelper.error(res, error.message, 500);
  }
};
