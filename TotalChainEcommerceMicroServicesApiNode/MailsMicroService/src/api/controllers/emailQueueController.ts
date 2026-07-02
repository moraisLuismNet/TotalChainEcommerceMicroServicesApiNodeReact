import { Request, Response } from "express";
import { EmailQueueService } from "../../services/emailQueueService";
import { ResponseHelper } from "../../core/helpers/ResponseHelper";

const emailQueueService = new EmailQueueService();

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const emails = await emailQueueService.getAll();
    ResponseHelper.ok(res, emails);
  } catch (error: any) {
    ResponseHelper.error(res, error.message, 500);
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const email = await emailQueueService.getById(id);
    if (!email) {
      ResponseHelper.notFound(res, "Email not found");
      return;
    }
    ResponseHelper.ok(res, email);
  } catch (error: any) {
    ResponseHelper.error(res, error.message, 500);
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const email = await emailQueueService.addToQueue(req.body);
    ResponseHelper.created(res, email);
  } catch (error: any) {
    ResponseHelper.error(res, error.message, 500);
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await emailQueueService.delete(id);
    if (!deleted) {
      ResponseHelper.notFound(res, "Email not found");
      return;
    }
    ResponseHelper.ok(res, null, "Email deleted successfully");
  } catch (error: any) {
    ResponseHelper.error(res, error.message, 500);
  }
};
