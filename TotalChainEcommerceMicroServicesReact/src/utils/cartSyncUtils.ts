import type { CartItem } from "../store/cartStore";

export class CartSyncService {
  private token: string;
  private userEmail: string;

  constructor(token: string, userEmail: string) {
    this.token = token;
    this.userEmail = userEmail;
  }

  async syncCartWithBackend(
    items: CartItem[]
  ): Promise<{ success: boolean; itemsSuccessful: number }> {
    try {
      const response = await fetch(
        `/api/cart-details/sync/${encodeURIComponent(this.userEmail)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.token}`,
          },
          body: JSON.stringify({
            items: items.map((item) => ({
              productId: item.id,
              amount: item.quantity,
            })),
          }),
        }
      );

      if (!response.ok) {
        return { success: false, itemsSuccessful: 0 };
      }

      return { success: true, itemsSuccessful: items.length };
    } catch {
      return { success: false, itemsSuccessful: 0 };
    }
  }
}
