import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { IProduct, ICartDetail } from "../interfaces/ecommerce.interfaces";
import { useAuthStore } from "./authStore";
import { cartDetailService } from "../services/cart-detail.service";

export interface CartItem extends IProduct {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  stockChanges: Record<string, number>;
  addItem: (item: IProduct) => void;
  removeItem: (id: string) => void;
  removeOne: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemQuantity: (id: string) => number;
  getStockChange: (id: string) => number;
  resetStockChanges: () => void;
  loadCartFromBackend: () => Promise<void>;
  restoreCartFromCancelledOrder: (orderId: number) => Promise<void>;
  isHydrated: boolean;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      stockChanges: {},
      isHydrated: false,

      addItem: (item) => {
        const { items, stockChanges } = get();
        const existingItem = items.find((i) => i.id === item.id);

        let newItems: CartItem[];
        if (existingItem) {
          newItems = items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          );
        } else {
          newItems = [...items, { ...item, quantity: 1 }];
        }

        const newTotal = newItems.reduce(
          (sum, i) => sum + i.unitPrice * i.quantity, 0
        );

        set({
          items: newItems,
          total: newTotal,
          stockChanges: {
            ...stockChanges,
            [item.id]: (stockChanges[item.id] || 0) - 1,
          },
        });

        const auth = useAuthStore.getState();
        if (auth.token && auth.user?.email) {
          cartDetailService.addToCart(auth.user.email, item.id, 1, item.unitPrice)
            .catch(() => {});
        }
      },

      removeItem: (id) => {
        const { items, stockChanges } = get();
        const item = items.find((i) => i.id === id);
        const quantity = item ? item.quantity : 0;

        const newItems = items.filter((item) => item.id !== id);
        const newTotal = newItems.reduce(
          (sum, i) => sum + i.unitPrice * i.quantity, 0
        );

        set({
          items: newItems,
          total: newTotal,
          stockChanges: {
            ...stockChanges,
            [id]: (stockChanges[id] || 0) + quantity,
          },
        });

        const auth = useAuthStore.getState();
        if (auth.token && auth.user?.email && item) {
          cartDetailService.removeFromCart(auth.user.email, id, quantity)
            .catch(() => {});
        }
      },

      removeOne: (id) => {
        const { items, stockChanges } = get();
        const existingItem = items.find((i) => i.id === id);

        if (existingItem) {
          if (existingItem.quantity > 1) {
            const newItems = items.map((i) =>
              i.id === id ? { ...i, quantity: i.quantity - 1 } : i
            );
            const newTotal = newItems.reduce(
              (sum, i) => sum + i.unitPrice * i.quantity, 0
            );
            set({
              items: newItems,
              total: newTotal,
              stockChanges: {
                ...stockChanges,
                [id]: (stockChanges[id] || 0) + 1,
              },
            });

            const auth = useAuthStore.getState();
            if (auth.token && auth.user?.email) {
              cartDetailService.removeFromCart(auth.user.email, id, 1)
                .catch(() => {});
            }
          } else {
            get().removeItem(id);
          }
        }
      },

      updateQuantity: (id, quantity) => {
        const { items, stockChanges } = get();
        const currentItem = items.find((i) => i.id === id);
        const currentQuantity = currentItem ? currentItem.quantity : 0;
        const difference = quantity - currentQuantity;

        if (quantity <= 0) {
          get().removeItem(id);
        } else {
          const newItems = items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          );
          const newTotal = newItems.reduce(
            (sum, i) => sum + i.unitPrice * i.quantity, 0
          );
          set({
            items: newItems,
            total: newTotal,
            stockChanges: {
              ...stockChanges,
              [id]: (stockChanges[id] || 0) - difference,
            },
          });

          if (difference !== 0) {
            const auth = useAuthStore.getState();
            if (auth.token && auth.user?.email && currentItem) {
              if (difference > 0) {
                cartDetailService.addToCart(auth.user.email, id, difference, currentItem.unitPrice)
                  .catch(() => {});
              } else {
                cartDetailService.removeFromCart(auth.user.email, id, -difference)
                  .catch(() => {});
              }
            }
          }
        }
      },

      clearCart: () => {
        set({ items: [], total: 0, stockChanges: {} });

        const auth = useAuthStore.getState();
        if (auth.token && auth.user?.email) {
          cartDetailService.clearCart(auth.user.email)
            .catch(() => {});
        }
      },

      getTotal: () => {
        const { items } = get();
        return items.reduce(
          (total, item) => total + item.unitPrice * item.quantity, 0
        );
      },

      getItemQuantity: (id) => {
        const { items } = get();
        const item = items.find((i) => i.id === id);
        return item ? item.quantity : 0;
      },

      getStockChange: (id) => {
        const { stockChanges } = get();
        return stockChanges[id] || 0;
      },

      resetStockChanges: () => {
        set({ stockChanges: {} });
      },

      loadCartFromBackend: async () => {
        const auth = useAuthStore.getState();
        if (!auth.token || !auth.user?.email) {
          set({ isHydrated: true });
          return;
        }
        try {
          let details: ICartDetail[] = [];
          try {
            details = await cartDetailService.getByEmail(auth.user.email);
          } catch {
            details = [];
          }
          if (details.length > 0) {
            const itemsMap = new Map<string, { amount: number; price: number }>();
            for (const d of details) {
              itemsMap.set(d.productId, { amount: d.amount, price: d.price ?? d.unitPrice });
            }
            const { items } = get();
            const merged = items.map(i => {
              const backend = itemsMap.get(i.id);
              if (backend) {
                itemsMap.delete(i.id);
                return { ...i, quantity: backend.amount, unitPrice: backend.price / backend.amount };
              }
              return i;
            });
            for (const [pid, data] of itemsMap) {
              try {
                const product = await import("../services/products.service").then(m => m.productsService.getById(pid));
                merged.push({ ...product, quantity: data.amount });
              } catch { /* product may no longer exist */ }
            }
            const newTotal = merged.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
            set({ items: merged, total: newTotal });
          }
        } catch {
          // backend cart may not exist yet — that's fine
        }
        set({ isHydrated: true });
      },

      restoreCartFromCancelledOrder: async (orderId: number) => {
        try {
          let token = useAuthStore.getState().token;
          let userEmail = useAuthStore.getState().user?.email;

          if (!token || !userEmail) {
            const tokenFromStorage = localStorage.getItem("token");
            const userFromStorage = localStorage.getItem("user");
            const authStorageStr = localStorage.getItem("auth-storage");
            
            if (tokenFromStorage && userFromStorage) {
              try {
                const parsed = JSON.parse(userFromStorage);
                token = tokenFromStorage;
                userEmail = parsed.email || parsed.Email || null;
              } catch {
                // ignore
              }
            }
            
            if (!token && authStorageStr) {
              try {
                const authStorage = JSON.parse(authStorageStr);
                token = authStorage.state?.token || null;
                userEmail = authStorage.state?.user?.email || userEmail;
              } catch {
                // ignore
              }
            }
          }

          if (!token || !userEmail) {
            throw new Error("User not authenticated");
          }

          const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          };

          const response = await fetch(
            `/api/orders/cancel/${encodeURIComponent(userEmail)}/${orderId}`,
            { method: "POST", headers }
          );

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to restore cart from cancelled order");
          }

          await get().loadCartFromBackend();
          get().resetStockChanges();

        } catch (error) {
          console.error("Failed to restore cart from cancelled order:", error);
          throw error;
        }
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
