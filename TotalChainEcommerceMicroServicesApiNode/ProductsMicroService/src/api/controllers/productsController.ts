import { Request, Response } from "express";
import { ProductService } from "../../services/productService";
import { HttpAuditLogService } from "../../services/httpClients/HttpAuditLogService";
import { HttpKardexService } from "../../services/httpClients/HttpKardexService";
import { StockRepository } from "../../database/repositories/StockRepository";
import { ResponseHelper } from "../../core/helpers/ResponseHelper";

const productService = new ProductService();
const stockRepository = new StockRepository();

export async function getAll(req: Request, res: Response) { try { const items = await productService.getAllAsync(); return ResponseHelper.success(res, "Products retrieved", items); } catch (e: any) { return ResponseHelper.error(res, "Failed", e.message); } }
export async function getById(req: Request, res: Response) { try { const { id } = req.params; const item = await productService.getByIdAsync(id); if (!item) return ResponseHelper.notFound(res, "Product not found"); return ResponseHelper.success(res, "Product retrieved", item); } catch (e: any) { return ResponseHelper.error(res, "Failed", e.message); } }
export async function getByReferenceId(req: Request, res: Response) { try { const { referenceId } = req.params; const items = await productService.getByReferenceIdAsync(referenceId); return ResponseHelper.success(res, "Products retrieved", items); } catch (e: any) { return ResponseHelper.error(res, "Failed", e.message); } }
export async function searchByName(req: Request, res: Response) { try { const { text } = req.params; const items = await productService.searchByNameAsync(text); return ResponseHelper.success(res, "Search results", items); } catch (e: any) { return ResponseHelper.error(res, "Failed", e.message); } }

export async function create(req: Request, res: Response) {
  try { 
    const { id, name } = req.body; 
    if (!id || !name) return ResponseHelper.badRequest(res, "Id and Name are required");
    const item = await productService.createAsync(req.body);
    await HttpAuditLogService.sendLog("Product", item.id, "Created", null, item, req.userEmail || "system");
    return ResponseHelper.created(res, "Product created", item);
  } catch (e: any) { 
    return ResponseHelper.error(res, "Failed", e.message); 
  }
}

export async function update(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const existing = await productService.getByIdAsync(id);
    if (!existing) return ResponseHelper.notFound(res, "Product not found");
    const updated = await productService.updateAsync(id, req.body);
    await HttpAuditLogService.sendLog("Product", id, "Updated", existing, updated, req.userEmail || "system");
    return ResponseHelper.success(res, "Product updated", updated);
  } catch (e: any) { 
    return ResponseHelper.error(res, "Failed", e.message);
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const existing = await productService.getByIdAsync(id);
    if (!existing) return ResponseHelper.notFound(res, "Product not found");
    await productService.deleteAsync(id);
    await HttpAuditLogService.sendLog("Product", id, "Deleted", existing, null, req.userEmail || "system");
    return ResponseHelper.success(res, "Product deleted");
  } catch (e: any) {
    return ResponseHelper.error(res, "Failed", e.message);
  }
}

export async function partialStockUpdate(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { quantity, warehouse } = req.body;
    if (quantity === undefined || !warehouse) return ResponseHelper.badRequest(res, "quantity and warehouse are required");

    const stockItems = await stockRepository.findByProductId(id);
    let stockItem = stockItems.find((s: any) => s.Warehouse === warehouse);

    const stockBefore = stockItem ? stockItem.Quantity : 0;
    const stockAfter = stockBefore + quantity;

    if (stockItem) {
      await stockRepository.update(stockItem.Id, { Quantity: stockAfter, UpdatedBy: req.userEmail || "system" } as any);
    } else {
      const newStock = await stockRepository.create({ Id: `${id}-${warehouse}`, ProductId: id, Quantity: stockAfter, warehouse: warehouse, CreatedBy: req.userEmail || "system", UpdatedBy: req.userEmail || "system" });
      stockItem = newStock;
    }

    const movementType = quantity >= 0 ? "Entry" : "Exit";
    await HttpKardexService.recordMovement(id, movementType, Math.abs(quantity), stockBefore, stockAfter);
    await HttpAuditLogService.sendLog("ProductStock", id, "StockUpdated", { stockBefore }, { stockAfter }, req.userEmail || "system");
    return ResponseHelper.success(res, "Stock updated", { productId: id, warehouse, stockBefore, stockAfter });
  } catch (e: any) {
    return ResponseHelper.error(res, "Failed to update stock", e.message);
  }
}
