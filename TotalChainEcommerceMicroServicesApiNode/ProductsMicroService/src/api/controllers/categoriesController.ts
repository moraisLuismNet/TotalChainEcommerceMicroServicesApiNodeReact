import { Request, Response } from "express";
import { CategoryService } from "../../services/categoryService";
import { ResponseHelper } from "../../core/helpers/ResponseHelper";
import { HttpAuditLogService } from "../../services/httpClients/HttpAuditLogService";

const categoryService = new CategoryService();

export async function getAll(req: Request, res: Response) {
  try {
    const items = await categoryService.getAllAsync();
    return ResponseHelper.success(res, "Categories retrieved", items);
  } catch (error: any) {
    return ResponseHelper.error(res, "Failed to retrieve categories", error.message);
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const item = await categoryService.getByIdAsync(id);
    if (!item) return ResponseHelper.notFound(res, "Category not found");
    return ResponseHelper.success(res, "Category retrieved", item);
  } catch (error: any) {
    return ResponseHelper.error(res, "Failed to retrieve category", error.message);
  }
}

export async function create(req: Request, res: Response) {
  try {
    const { name } = req.body;
    if (!name) return ResponseHelper.badRequest(res, "Name is required");
    const item = await categoryService.createAsync(req.body);
    await HttpAuditLogService.sendLog("Category", item.id, "Created", null, item, req.userEmail || "system");
    return ResponseHelper.created(res, "Category created", item);
  } catch (error: any) {
    return ResponseHelper.error(res, "Failed to create category", error.message);
  }
}

export async function update(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const existing = await categoryService.getByIdAsync(id);
    if (!existing) return ResponseHelper.notFound(res, "Category not found");
    const updated = await categoryService.updateAsync(id, req.body);
    await HttpAuditLogService.sendLog("Category", id, "Updated", existing, updated, req.userEmail || "system");
    return ResponseHelper.success(res, "Category updated", updated);
  } catch (error: any) {
    return ResponseHelper.error(res, "Failed to update category", error.message);
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const existing = await categoryService.getByIdAsync(id);
    if (!existing) return ResponseHelper.notFound(res, "Category not found");
    await categoryService.deleteAsync(id);
    await HttpAuditLogService.sendLog("Category", id, "Deleted", existing, null, req.userEmail || "system");
    return ResponseHelper.success(res, "Category deleted");
  } catch (error: any) {
    return ResponseHelper.error(res, "Failed to delete category", error.message);
  }
}
