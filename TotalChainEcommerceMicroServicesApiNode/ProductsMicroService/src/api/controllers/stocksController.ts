import { Request, Response } from "express";
import { StockService } from "../../services/stockService";
import { ProductService } from "../../services/productService";
import { ResponseHelper } from "../../core/helpers/ResponseHelper";
import { HttpKardexService } from "../../services/httpClients/HttpKardexService";
import { HttpMailsService } from "../../services/httpClients/HttpMailsService";

const stockService = new StockService();
const productService = new ProductService();

const ADMIN_EMAIL = process.env.EMAIL_ADMIN_EMAIL || "luism.desarrollo@gmail.com";

async function checkLowStock(productId: string, currentStock: number): Promise<void> {
  try {
    const product = await productService.getByIdAsync(productId);
    if (!product) return;
    const minStock = product.minStock ?? 5;
    if (currentStock <= minStock) {
      const subject = `Low Stock Alert: ${product.name}`;
      const body = `
        <div style="font-family:Arial,sans-serif;color:#333;max-width:600px;margin:0 auto;border:1px solid #eee;padding:20px;border-radius:10px;">
          <h2 style="color:#dc3545;">Low Stock Alert</h2>
          <p>The product <strong>${product.name}</strong> (ID: ${productId}) has <strong>${currentStock}</strong> units in stock, which is at or below the minimum of <strong>${minStock}</strong>.</p>
          <p>Please restock as soon as possible.</p>
          <hr style="border:0;border-top:1px solid #eee;margin:20px 0;" />
          <p style="font-size:0.8em;color:#999;text-align:center;">This is an automated message from TotalChain E-Commerce.</p>
        </div>`;
      await HttpMailsService.sendEmail(ADMIN_EMAIL, subject, body, "LowStock");
    }
  } catch (err) {
    console.error("[checkLowStock] Error:", err);
  }
}

export async function getAll(req: Request, res: Response) { try { const items = await stockService.getAllAsync(); return ResponseHelper.success(res, "Stocks retrieved", items); } catch (e: any) { return ResponseHelper.error(res, "Failed", e.message); } }
export async function getById(req: Request, res: Response) { try { const { id } = req.params; const item = await stockService.getByIdAsync(id); if (!item) return ResponseHelper.notFound(res, "Stock not found"); return ResponseHelper.success(res, "Stock retrieved", item); } catch (e: any) { return ResponseHelper.error(res, "Failed", e.message); } }
export async function getByProductId(req: Request, res: Response) { try { const { productId } = req.params; const items = await stockService.getByProductIdAsync(productId); return ResponseHelper.success(res, "Stocks retrieved", items); } catch (e: any) { return ResponseHelper.error(res, "Failed", e.message); } }
export async function create(req: Request, res: Response) { try { const { id, productId, quantity } = req.body; if (!id || !productId || quantity === undefined) return ResponseHelper.badRequest(res, "Id, productId and quantity are required"); const item = await stockService.createAsync(req.body); return ResponseHelper.created(res, "Stock entry created", item); } catch (e: any) { return ResponseHelper.error(res, "Failed", e.message); } }
export async function update(req: Request, res: Response) { try { const { id } = req.params; const { quantity } = req.body; if (quantity === undefined) return ResponseHelper.badRequest(res, "quantity is required"); const item = await stockService.updateAsync(id, req.userEmail || "system", quantity); return ResponseHelper.success(res, "Stock updated", item); } catch (e: any) { return ResponseHelper.error(res, "Failed", e.message); } }
export async function remove(req: Request, res: Response) { try { const { id } = req.params; const result = await stockService.deleteAsync(id); if (!result) return ResponseHelper.notFound(res, "Stock not found"); return ResponseHelper.success(res, "Stock deleted"); } catch (e: any) { return ResponseHelper.error(res, "Failed", e.message); } }

export async function reserveStock(req: Request, res: Response) {
  try {
    const { productId, quantity } = req.body;
    if (!productId || quantity === undefined || quantity < 0) return ResponseHelper.badRequest(res, "productId and quantity (>0) are required");
    const stockItems = await stockService.getByProductIdAsync(productId);
    if (stockItems.length === 0) return ResponseHelper.badRequest(res, "No stock entries for this product");
    const totalBefore = stockItems.reduce((sum, s) => sum + s.quantity, 0);
    let toReserve = quantity;
    for (const s of stockItems) {
      if (toReserve <= 0) break;
      const deduct = Math.min(toReserve, s.quantity);
      await stockService.updateAsync(s.id, req.userEmail || "system", s.quantity - deduct);
      toReserve -= deduct;
    }
    if (toReserve > 0) return ResponseHelper.badRequest(res, "Insufficient stock");
    const totalAfter = totalBefore - quantity;
    await HttpKardexService.recordMovement(productId, "Exit", quantity, totalBefore, totalAfter);

    // Low stock check
    checkLowStock(productId, totalAfter).catch(err =>
      console.error("[reserveStock] Low stock check failed:", err)
    );

    return ResponseHelper.success(res, "Stock reserved", { productId, quantity });
  } catch (e: any) { return ResponseHelper.error(res, "Failed", e.message); }
}

export async function addStock(req: Request, res: Response) {
  try {
    const { productId, quantity } = req.body;
    if (!productId || quantity === undefined || quantity <= 0) return ResponseHelper.badRequest(res, "productId and quantity (>0) are required");
    const stockItems = await stockService.getByProductIdAsync(productId);
    if (stockItems.length === 0) return ResponseHelper.badRequest(res, "No stock entries for this product");
    const totalBefore = stockItems.reduce((sum, s) => sum + s.quantity, 0);
    // Add the full quantity to the first stock entry (simplest approach)
    const first = stockItems[0];
    await stockService.updateAsync(first.id, req.userEmail || "system", first.quantity + quantity);
    const totalAfter = totalBefore + quantity;
    return ResponseHelper.success(res, "Stock added", { productId, quantity, stockBefore: totalBefore, stockAfter: totalAfter });
  } catch (e: any) { return ResponseHelper.error(res, "Failed", e.message); }
}

export async function removeStock(req: Request, res: Response) {
  try {
    const { productId, quantity } = req.body;
    if (!productId || quantity === undefined || quantity <= 0) return ResponseHelper.badRequest(res, "productId and quantity (>0) are required");
    const stockItems = await stockService.getByProductIdAsync(productId);
    if (stockItems.length === 0) return ResponseHelper.badRequest(res, "No stock entries for this product");
    const totalBefore = stockItems.reduce((sum, s) => sum + s.quantity, 0);
    if (totalBefore < quantity) return ResponseHelper.badRequest(res, "Insufficient stock");
    let toRemove = quantity;
    for (const s of stockItems) {
      if (toRemove <= 0) break;
      const deduct = Math.min(toRemove, s.quantity);
      await stockService.updateAsync(s.id, req.userEmail || "system", s.quantity - deduct);
      toRemove -= deduct;
    }
    const totalAfter = totalBefore - quantity;
    return ResponseHelper.success(res, "Stock removed", { productId, quantity, stockBefore: totalBefore, stockAfter: totalAfter });
  } catch (e: any) { return ResponseHelper.error(res, "Failed", e.message); }
}

export async function releaseStock(req: Request, res: Response) {
  try {
    const { productId, quantity } = req.body;
    if (!productId || quantity === undefined || quantity < 0) return ResponseHelper.badRequest(res, "productId and quantity (>0) are required");
    const stockItems = await stockService.getByProductIdAsync(productId);
    if (stockItems.length === 0) return ResponseHelper.badRequest(res, "No stock entries for this product");
    const totalBefore = stockItems.reduce((sum, s) => sum + s.quantity, 0);
    let toRelease = quantity;
    for (const s of stockItems) {
      if (toRelease <= 0) break;
      const add = Math.min(toRelease, s.quantity);
      await stockService.updateAsync(s.id, req.userEmail || "system", s.quantity + add);
      toRelease -= add;
    }
    const totalAfter = totalBefore + quantity;
    await HttpKardexService.recordMovement(productId, "Entry", quantity, totalBefore, totalAfter);
    return ResponseHelper.success(res, "Stock released", { productId, quantity });
  } catch (e: any) { return ResponseHelper.error(res, "Failed", e.message); }
}
