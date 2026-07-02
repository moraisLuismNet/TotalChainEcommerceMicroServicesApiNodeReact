import { Request, Response } from "express";
import { CartService } from "../../services/cartService";
import { ResponseHelper } from "../../core/helpers/ResponseHelper";

const cartService = new CartService();

export async function getDetails(req: Request, res: Response) {
  try {
    const { email } = req.params;
    const details = await cartService.getCartDetails(email);
    return ResponseHelper.success(res, "Cart details retrieved", details || []);
  } catch (e: any) { return ResponseHelper.error(res, "Failed", e.message); }
}

export async function addItem(req: Request, res: Response) {
  try {
    const { email } = req.params;
    const { productId, amount, price } = req.body;
    if (!productId || !amount || !price) return ResponseHelper.badRequest(res, "productId, amount and price are required");
    const result = await cartService.addItemToCart(email, { productId, amount, price, productName: req.body.productName, unitPrice: req.body.unitPrice });
    return ResponseHelper.success(res, "Item added", result);
  } catch (e: any) { return ResponseHelper.error(res, "Failed", e.message); }
}

export async function removeItem(req: Request, res: Response) {
  try {
    const { email, productId } = req.params;
    const amount = req.query.amount ? parseInt(req.query.amount as string, 10) : undefined;
    if (amount && amount > 0) {
      const result = await cartService.decrementCartItem(email, productId, amount);
      return ResponseHelper.success(res, "Item quantity reduced", result);
    }
    const result = await cartService.removeItemFromCartByProduct(email, productId);
    return ResponseHelper.success(res, "Item removed", result);
  } catch (e: any) { return ResponseHelper.error(res, "Failed", e.message); }
}
