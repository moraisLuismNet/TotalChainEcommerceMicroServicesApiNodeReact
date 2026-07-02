import { useCallback } from "react";
import { useCartStore } from "../store/cartStore";
import type { IProduct } from "../interfaces/ecommerce.interfaces";

export const useCart = () => {
  const {
    items,
    total,
    addItem,
    removeItem,
    removeOne,
    updateQuantity,
    clearCart,
    loadCartFromBackend,
    isHydrated,
  } = useCartStore();

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddItem = useCallback((item: IProduct) => { addItem(item); }, [addItem]);
  const handleRemoveItem = useCallback((id: string) => { removeItem(id); }, [removeItem]);
  const handleRemoveOne = useCallback((id: string) => { removeOne(id); }, [removeOne]);
  const handleUpdateQuantity = useCallback(
    (id: string, quantity: number) => { updateQuantity(id, quantity); }, [updateQuantity]
  );

  return {
    items,
    total,
    cartCount,
    isHydrated,
    addItem: handleAddItem,
    removeItem: handleRemoveItem,
    removeOne: handleRemoveOne,
    updateQuantity: handleUpdateQuantity,
    clearCart,
    loadCartFromBackend,
  };
};
