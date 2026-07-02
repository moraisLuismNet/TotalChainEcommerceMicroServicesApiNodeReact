import { CartRepository } from "../database/repositories/CartRepository";
import { CartDetailRepository } from "../database/repositories/CartDetailRepository";
import { AddToCartDTO } from "../core/dtos/Cart/AddToCartDTO";
import { UpdateCartItemDTO } from "../core/dtos/Cart/UpdateCartItemDTO";
import { HttpPaymentService } from "./httpClients/HttpPaymentService";
import { HttpAuditLogService } from "./httpClients/HttpAuditLogService";
import { HttpProductService } from "./httpClients/HttpProductService";

export class CartService {
  private cartRepo: CartRepository;
  private detailRepo: CartDetailRepository;

  constructor() {
    this.cartRepo = new CartRepository();
    this.detailRepo = new CartDetailRepository();
  }

  async getAllCarts() {
    const carts = await this.cartRepo.getAll({ order: [["IdCart", "DESC"]] });
    return Promise.all(carts.map(async (c) => {
      const details = await this.detailRepo.getByCartId(c.IdCart);
      return {
        idCart: c.IdCart,
        userEmail: c.UserEmail,
        totalPrice: c.TotalPrice,
        enabled: c.Enabled,
        cartDetails: details.map(d => ({
          idCartDetail: d.IdCartDetail,
          productId: d.ProductId,
          amount: d.Amount,
          price: Number(d.Price),
          total: Number(d.Price),
        })),
      };
    }));
  }

  async getCartByUserEmail(email: string) {
    const cart = await this.cartRepo.getActiveCartByUser(email);
    if (!cart) return null;
    const details = await this.detailRepo.getByCartId(cart.IdCart);
    return { cart: { idCart: cart.IdCart, userEmail: cart.UserEmail, totalPrice: cart.TotalPrice, enabled: cart.Enabled }, details: details.map(d => ({ idCartDetail: d.IdCartDetail, cartId: d.CartId, productId: d.ProductId, amount: d.Amount, price: d.Price })) };
  }

  async getCartStatus(email: string) {
    const cart = await this.cartRepo.getByUserEmail(email);
    if (!cart) return null;
    return { idCart: cart.IdCart, enabled: cart.Enabled };
  }

  async getCartDetails(email: string) {
    const cart = await this.cartRepo.getActiveCartByUser(email);
    if (!cart) return null;
    const details = await this.detailRepo.getByCartId(cart.IdCart);
    return details.map(d => ({ idCartDetail: d.IdCartDetail, cartId: d.CartId, productId: d.ProductId, amount: d.Amount, price: d.Price }));
  }

  async getCartCount(email: string) {
    const cart = await this.cartRepo.getActiveCartByUser(email);
    if (!cart) return { count: 0 };
    const details = await this.detailRepo.getByCartId(cart.IdCart);
    return { count: details.length };
  }

  async addItemToCart(email: string, dto: AddToCartDTO) {
    let cart = await this.cartRepo.getActiveCartByUser(email);
    if (!cart) {
      cart = await this.cartRepo.getByUserEmail(email);
    }
    if (!cart) {
      cart = await this.cartRepo.create({ UserEmail: email, TotalPrice: 0, Enabled: true });
    } else if (!cart.Enabled) {
      await this.cartRepo.update(cart.IdCart, { Enabled: true } as any);
      cart.Enabled = true;
    }
    let item = await this.detailRepo.getByCartAndProduct(cart.IdCart, dto.productId);
    if (item) {
      item.Amount += dto.amount;
      item.Price = dto.price * item.Amount;
      await this.detailRepo.update(item.IdCartDetail, { Amount: item.Amount, Price: item.Price });
    } else {
      item = await this.detailRepo.create({ CartId: cart.IdCart, ProductId: dto.productId, Amount: dto.amount, Price: dto.price });
    }
    await HttpProductService.reserveStock(dto.productId, dto.amount);
    const allDetails = await this.detailRepo.getByCartId(cart.IdCart);
    const total = allDetails.reduce((sum, d) => sum + Number(d.Price), 0);
    await this.cartRepo.update(cart.IdCart, { TotalPrice: total } as any);
    await HttpAuditLogService.sendLog("CartItem", dto.productId, "Added", null, { amount: dto.amount, price: dto.price }, email);
    return { cartId: cart.IdCart, item };
  }

  async updateCartItem(email: string, dto: UpdateCartItemDTO) {
    const item = await this.detailRepo.getById(dto.idCartDetail);
    if (!item) throw new Error("Item not found");
    const cart = await this.cartRepo.getById(item.CartId);
    if (!cart || cart.UserEmail !== email) throw new Error("Cart not found or not owned");
    await this.detailRepo.update(dto.idCartDetail, { Amount: dto.amount, Price: dto.price } as any);
    const allDetails = await this.detailRepo.getByCartId(cart.IdCart);
    const total = allDetails.reduce((sum, d) => sum + Number(d.Price), 0);
    await this.cartRepo.update(cart.IdCart, { TotalPrice: total } as any);
    return { cartId: cart.IdCart };
  }

  async removeItemFromCart(itemId: number, email: string) {
    const item = await this.detailRepo.getById(itemId);
    if (!item) throw new Error("Item not found");
    const cart = await this.cartRepo.getById(item.CartId);
    if (!cart || cart.UserEmail !== email) throw new Error("Cart not found or not owned");
    await this.detailRepo.delete(itemId);
    const allDetails = await this.detailRepo.getByCartId(cart.IdCart);
    const total = allDetails.reduce((sum, d) => sum + Number(d.Price), 0);
    await this.cartRepo.update(cart.IdCart, { TotalPrice: total } as any);
    await HttpAuditLogService.sendLog("CartItem", item.ProductId, "Removed", item, null, email);
    return { cartId: cart.IdCart };
  }

  async decrementCartItem(email: string, productId: string, amount: number) {
    const cart = await this.cartRepo.getActiveCartByUser(email);
    if (!cart) return { cartId: null };
    const item = await this.detailRepo.getByCartAndProduct(cart.IdCart, productId);
    if (!item) return { cartId: cart.IdCart };
    const newAmount = item.Amount - amount;
    if (newAmount <= 0) {
      return this.removeItemFromCartByProduct(email, productId);
    }
    await HttpProductService.releaseStock(productId, amount);
    const unitPrice = Number(item.Price) / item.Amount;
    await this.detailRepo.update(item.IdCartDetail, { Amount: newAmount, Price: unitPrice * newAmount });
    const allDetails = await this.detailRepo.getByCartId(cart.IdCart);
    const total = allDetails.reduce((sum, d) => sum + Number(d.Price), 0);
    await this.cartRepo.update(cart.IdCart, { TotalPrice: total } as any);
    await HttpAuditLogService.sendLog("CartItem", productId, "Decremented", item, { newAmount }, email);
    return { cartId: cart.IdCart };
  }

  async removeItemFromCartByProduct(email: string, productId: string) {
    const cart = await this.cartRepo.getActiveCartByUser(email);
    if (!cart) return { cartId: null };
    const item = await this.detailRepo.getByCartAndProduct(cart.IdCart, productId);
    if (!item) return { cartId: cart.IdCart };
    await HttpProductService.releaseStock(productId, item.Amount);
    await this.detailRepo.delete(item.IdCartDetail);
    const allDetails = await this.detailRepo.getByCartId(cart.IdCart);
    const total = allDetails.reduce((sum, d) => sum + Number(d.Price), 0);
    await this.cartRepo.update(cart.IdCart, { TotalPrice: total } as any);
    await HttpAuditLogService.sendLog("CartItem", productId, "Removed", item, null, email);
    return { cartId: cart.IdCart };
  }

  async emptyCart(email: string) {
    const cart = await this.cartRepo.getByUserEmail(email);
    if (!cart) return { cartId: null };
    const details = await this.detailRepo.getByCartId(cart.IdCart);
    for (const d of details) {
      await HttpProductService.releaseStock(d.ProductId, d.Amount).catch(() => {});
    }
    await this.detailRepo.deleteByCartId(cart.IdCart);
    await this.cartRepo.update(cart.IdCart, { TotalPrice: 0, Enabled: true } as any);
    return { cartId: cart.IdCart };
  }

  async enableCart(email: string) {
    const cart = await this.cartRepo.getByUserEmail(email);
    if (!cart) throw new Error("Cart not found");
    await this.cartRepo.update(cart.IdCart, { Enabled: true } as any);
    await HttpAuditLogService.sendLog("Cart", cart.IdCart.toString(), "Enabled", null, null, email);
    return { cartId: cart.IdCart };
  }

  async disableCart(email: string) {
    const cart = await this.cartRepo.getByUserEmail(email);
    if (!cart) throw new Error("Cart not found");
    await this.cartRepo.update(cart.IdCart, { Enabled: false } as any);
    await HttpAuditLogService.sendLog("Cart", cart.IdCart.toString(), "Disabled", null, null, email);
    return { cartId: cart.IdCart };
  }

  async checkout(email: string, body: any) {
    const cart = await this.cartRepo.getActiveCartByUser(email);
    if (!cart) throw new Error("No active cart found");
    const details = await this.detailRepo.getByCartId(cart.IdCart);
    if (details.length === 0) throw new Error("Cannot checkout empty cart");
    const total = details.reduce((sum, d) => sum + Number(d.Price), 0);
    if (total <= 0) throw new Error("Invalid total");
    // Build items array for PaymentMS
    const items = details.map(d => ({
      name: d.ProductId,
      quantity: d.Amount,
      price: Number(d.Price) / d.Amount, // unit price in euros (StripeProvider ×100 → cents)
    }));
    const session = await HttpPaymentService.createCheckoutSession(items, email);
    if (!session) throw new Error("Failed to create checkout session");
    return { checkoutUrl: session.url || session.redirectUrl, sessionId: session.sessionId, total };
  }
}
