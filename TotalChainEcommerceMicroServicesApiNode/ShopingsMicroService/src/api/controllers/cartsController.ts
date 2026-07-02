import { Request, Response } from "express";
import { CartService } from "../../services/cartService";
import { ResponseHelper } from "../../core/helpers/ResponseHelper";

const cartService = new CartService();

export async function getAllCarts(req: Request, res: Response) {
  try {
    const carts = await cartService.getAllCarts();
    return ResponseHelper.success(res, "All carts retrieved", carts);
  } catch (e: any) { return ResponseHelper.error(res, "Failed", e.message); }
}

export async function getCart(req: Request, res: Response) {
  try {
    const email = req.userEmail;
    if (!email) return ResponseHelper.unauthorized(res);
    const cart = await cartService.getCartByUserEmail(email);
    if (!cart) return ResponseHelper.notFound(res, "Cart not found");
    return ResponseHelper.success(res, "Cart retrieved", cart);
  } catch (e: any) { return ResponseHelper.error(res, "Failed", e.message); }
}

export async function getCartByEmail(req: Request, res: Response) {
  try {
    const { email } = req.params;
    const cart = await cartService.getCartByUserEmail(email);
    if (!cart) return ResponseHelper.notFound(res, "Cart not found");
    return ResponseHelper.success(res, "Cart retrieved", cart);
  } catch (e: any) { return ResponseHelper.error(res, "Failed", e.message); }
}

export async function getCartStatus(req: Request, res: Response) {
  try {
    const { email } = req.params;
    const status = await cartService.getCartStatus(email);
    if (!status) return ResponseHelper.notFound(res, "Cart not found");
    return ResponseHelper.success(res, "Cart status", status);
  } catch (e: any) { return ResponseHelper.error(res, "Failed", e.message); }
}

export async function getCartDetails(req: Request, res: Response) {
  try {
    const { email } = req.params;
    const details = await cartService.getCartDetails(email);
    if (!details) return ResponseHelper.notFound(res, "Cart not found");
    return ResponseHelper.success(res, "Cart details", details);
  } catch (e: any) { return ResponseHelper.error(res, "Failed", e.message); }
}

export async function getCartCount(req: Request, res: Response) {
  try {
    const { email } = req.params;
    const count = await cartService.getCartCount(email);
    return ResponseHelper.success(res, "Cart item count", count);
  } catch (e: any) { return ResponseHelper.error(res, "Failed", e.message); }
}

export async function addItemByEmail(req: Request, res: Response) {
  try {
    const { email } = req.params;
    const { productId, amount, price } = req.body;
    if (!productId || !amount || !price) return ResponseHelper.badRequest(res, "productId, amount and price are required");
    const result = await cartService.addItemToCart(email, { productId, amount, price, productName: req.body.productName, unitPrice: req.body.unitPrice });
    return ResponseHelper.success(res, "Item added to cart", result);
  } catch (e: any) { return ResponseHelper.error(res, "Failed", e.message); }
}

export async function updateItemByEmail(req: Request, res: Response) {
  try {
    const { email } = req.params;
    const { idCartDetail, amount, price } = req.body;
    if (!idCartDetail || !amount || !price) return ResponseHelper.badRequest(res, "idCartDetail, amount and price are required");
    const result = await cartService.updateCartItem(email, { idCartDetail, amount, price });
    return ResponseHelper.success(res, "Cart item updated", result);
  } catch (e: any) { return ResponseHelper.error(res, "Failed", e.message); }
}

export async function removeItemByEmail(req: Request, res: Response) {
  try {
    const { email, productId } = req.params;
    const result = await cartService.removeItemFromCartByProduct(email, productId);
    return ResponseHelper.success(res, "Item removed", result);
  } catch (e: any) { return ResponseHelper.error(res, "Failed", e.message); }
}

export async function emptyCart(req: Request, res: Response) {
  try {
    const email = req.userEmail;
    if (!email) return ResponseHelper.unauthorized(res);
    const result = await cartService.emptyCart(email);
    return ResponseHelper.success(res, "Cart emptied", result);
  } catch (e: any) { return ResponseHelper.error(res, "Failed", e.message); }
}

export async function checkout(req: Request, res: Response) {
  try {
    const email = req.userEmail;
    if (!email) return ResponseHelper.unauthorized(res);
    const result = await cartService.checkout(email, req.body);
    return ResponseHelper.success(res, "Checkout initiated", result);
  } catch (e: any) { return ResponseHelper.error(res, "Checkout failed", e.message); }
}

export async function enableCart(req: Request, res: Response) {
  try {
    const { email } = req.params;
    const result = await cartService.enableCart(email);
    return ResponseHelper.success(res, "Cart enabled", result);
  } catch (e: any) { return ResponseHelper.error(res, "Failed", e.message); }
}

export async function disableCart(req: Request, res: Response) {
  try {
    const { email } = req.params;
    const result = await cartService.disableCart(email);
    return ResponseHelper.success(res, "Cart disabled", result);
  } catch (e: any) { return ResponseHelper.error(res, "Failed", e.message); }
}
