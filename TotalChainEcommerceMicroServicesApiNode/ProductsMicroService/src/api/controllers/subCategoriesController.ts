import { Request, Response } from "express";
import { SubCategoryService } from "../../services/subCategoryService";
import { HttpAuditLogService } from "../../services/httpClients/HttpAuditLogService";
import { ResponseHelper } from "../../core/helpers/ResponseHelper";

const subCategoryService = new SubCategoryService();

export async function getAll(req: Request, res: Response) {
  try { const items = await subCategoryService.getAllAsync(); return ResponseHelper.success(res, "SubCategories retrieved", items); }
  catch (e: any) { return ResponseHelper.error(res, "Failed to retrieve subcategories", e.message); }
}

export async function getById(req: Request, res: Response) {
  try { const { id } = req.params; const item = await subCategoryService.getByIdAsync(id); if (!item) return ResponseHelper.notFound(res, "SubCategory not found"); return ResponseHelper.success(res, "SubCategory retrieved", item); }
  catch (e: any) { return ResponseHelper.error(res, "Failed to retrieve subcategory", e.message); }
}

export async function create(req: Request, res: Response) {
  try { const { name, id } = req.body; if (!name || !id) return ResponseHelper.badRequest(res, "Id and Name are required"); const item = await subCategoryService.createAsync(req.body); await HttpAuditLogService.sendLog("SubCategory", item.id, "Created", null, item, req.userEmail || "system"); return ResponseHelper.created(res, "SubCategory created", item); }
  catch (e: any) { return ResponseHelper.error(res, "Failed to create subcategory", e.message); }
}

export async function update(req: Request, res: Response) {
  try { const { id } = req.params; const existing = await subCategoryService.getByIdAsync(id); if (!existing) return ResponseHelper.notFound(res, "SubCategory not found"); const updated = await subCategoryService.updateAsync(id, req.body); await HttpAuditLogService.sendLog("SubCategory", id, "Updated", existing, updated, req.userEmail || "system"); return ResponseHelper.success(res, "SubCategory updated", updated); }
  catch (e: any) { return ResponseHelper.error(res, "Failed to update subcategory", e.message); }
}

export async function getByCategory(req: Request, res: Response) {
  try { const { categoryId } = req.params; const items = await subCategoryService.getByCategoryAsync(categoryId); return ResponseHelper.success(res, "SubCategories retrieved", items); }
  catch (e: any) { return ResponseHelper.error(res, "Failed to retrieve subcategories", e.message); }
}

export async function remove(req: Request, res: Response) {
  try { const { id } = req.params; const existing = await subCategoryService.getByIdAsync(id); if (!existing) return ResponseHelper.notFound(res, "SubCategory not found"); await subCategoryService.deleteAsync(id); await HttpAuditLogService.sendLog("SubCategory", id, "Deleted", existing, null, req.userEmail || "system"); return ResponseHelper.success(res, "SubCategory deleted"); }
  catch (e: any) { return ResponseHelper.error(res, "Failed to delete subcategory", e.message); }
}
